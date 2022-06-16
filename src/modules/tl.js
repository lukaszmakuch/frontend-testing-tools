const { noop } = require("lodash");
const waitForExpect = require("wait-for-expect");

// Serialized so that we can pass RegExps from this test via selenium to the browser.
function serializeTextMatch(textMatch) {
  if (textMatch instanceof RegExp) {
    return JSON.stringify({
      type: "regexp",
      source: textMatch.source,
      flags: textMatch.flags,
    });
  }

  if (textMatch) return JSON.stringify({ type: "string", value: textMatch });

  return undefined;
}

function unserializeTextMatch(serializedTextMatch) {
  if (!serializedTextMatch) return undefined;

  const unserialized = JSON.parse(serializedTextMatch);
  switch (unserialized.type) {
    case "string":
      return unserialized.value;
    case "regexp":
      return new RegExp(unserialized.source, unserialized.flags);
    default:
      throw new Error(
        "An error occurred while trying to deserialize a TextMatch (" +
          serializedTextMatch +
          ")"
      );
  }
}

function serializeTestingLibraryOptions(options = {}) {
  return JSON.stringify({
    ...options,
    name: serializeTextMatch(options.name),
    description: serializeTextMatch(options.description),
  });
}

function unserializeTestingLibraryOptions(serializedOptions) {
  const unserialized = JSON.parse(serializedOptions);
  return {
    ...unserialized,
    name: unserializeTextMatch(unserialized.name),
    description: unserializeTextMatch(unserialized.description),
  };
}

let testingLibraryModule = {
  serializeTextMatch,
  unserializeTextMatch,

  installIfNeeded: async function () {
    if (this._testingLibraryInstalled) return;

    await this.driver.executeScript(`
      const url = 'https://unpkg.com/@testing-library/dom@8.13.0/dist/@testing-library/dom.umd.js';
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("src", url); 
      scriptTag.setAttribute("type", "text/javascript"); 
      document.head.appendChild(scriptTag);
      window.unserializeTextMatch = ${unserializeTextMatch};
      window.unserializeTestingLibraryOptions = ${unserializeTestingLibraryOptions};
    `);

    await waitForExpect(async () => {
      const notInstalled = await this.driver.executeScript(`
        return typeof(window.TestingLibraryDom) === "undefined";
      `);
      if (notInstalled) throw new Error("Testing Library not installed");
    });

    // TODO: include it from some offline source

    this._testingLibraryInstalled = true;
  },

  findByRole: async function (roleTextMatch, options, cb) {
    await this.tlInstallIfNeeded();
    const element = await this.driver.executeScript(
      `
      return window.TestingLibraryDom.findByRole(
        document,
        window.unserializeTextMatch(arguments[0]),
        window.unserializeByRoleOptions(arguments[1]),
      )
    `,
      serializeTextMatch(roleTextMatch),
      serializeByRoleOptions(options)
    );
    await cb(element);
  },

  findByText: async function (textMatch, cb = noop) {
    await this.tlInstallIfNeeded();
    const element = await this.driver.executeScript(
      `
      return window.TestingLibraryDom.findByText(document, window.unserializeTextMatch(arguments[0]))
    `,
      serializeTextMatch(textMatch)
    );
    await cb(element);
  },

  // TODO: findByAnyText based on the hierarchy described here https://testing-library.com/docs/queries/about/
};

// Queries
[
  "findByRole",
  "findByLabelText",
  "findByPlaceholderText",
  "findByText",
  "findByDisplayValue",
  "findByAltText",
  "findByTitle",
  "findByTestId",
].forEach((queryFnName) => {
  testingLibraryModule[queryFnName] = async function (
    firstParam,
    maybeOptions,
    maybeCb
  ) {
    const options = maybeCb ? maybeOptions : {};
    const cb = maybeCb ?? maybeOption;

    await this.tlInstallIfNeeded();
    const element = await this.driver.executeScript(
      `
      return window.TestingLibraryDom[arguments[0]](
        document,
        window.unserializeTextMatch(arguments[1]),
        window.unserializeTestingLibraryOptions(arguments[2]),
      )
    `,
      queryFnName,
      serializeTextMatch(firstParam),
      serializeTestingLibraryOptions(options)
    );
    await cb(element);
  };
});

module.exports = testingLibraryModule;
