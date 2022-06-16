const {
  noop,
  isFunction,
  cond,
  isPlainObject,
  isRegExp,
  conforms,
  constant,
  isString,
} = require("lodash");
const waitForExpect = require("wait-for-expect");

// Serialized so that we can pass RegExps from this test via selenium to the browser.

function isTextMatch(maybeTextMatch) {
  return isRegExp(maybeTextMatch) || isString(maybeTextMatch);
}

function serializeTextMatch(textMatch) {
  if (isRegExp(textMatch)) {
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

  // TODO: findByAnyText based on the hierarchy described here https://testing-library.com/docs/queries/about/
};

// Queries:
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
  testingLibraryModule[queryFnName] = async function (...args) {
    // prettier-ignore
    const [containerName, matcher, options, cb] = cond([
      [
        conforms([ isString, isTextMatch, isPlainObject, isFunction ]),
        constant([ args[0], args[1], args[2], args[3] ])
      ],
      [
        conforms([ isTextMatch, isPlainObject, isFunction ]),
        constant([ null, args[0], args[1], args[2] ])
      ],

      [
        conforms([ isString, isTextMatch, isPlainObject ]),
        constant([ args[0], args[1], args[2], null ])
      ],
      [
        conforms([ isTextMatch, isPlainObject ]),
        constant([ null, args[0], args[1], null ])
      ],

      [
        conforms([ isString, isTextMatch, isFunction ]),
        constant([ args[0], args[1], {}, args[2] ])
      ],
      [
        conforms([ isTextMatch, isFunction ]),
        constant([ null, args[0], {}, args[1] ])
      ],

      [
        conforms([ isString, isTextMatch ]),
        constant([ args[0], args[1], {}, null ])
      ],
      [
        conforms([ isTextMatch ]),
        constant([ null, args[0], {}, null ])
      ],

    ])(args);

    await this.tlInstallIfNeeded();
    const containerElem = containerName
      ? await this.containerGet(containerName)
      : undefined;
    const element = await this.driver.executeScript(
      `
      return window.TestingLibraryDom.within(
        arguments[1] ?? document
      )[arguments[0]](
        window.unserializeTextMatch(arguments[2]),
        window.unserializeTestingLibraryOptions(arguments[3]),
      );
    `,
      queryFnName,
      containerElem,
      serializeTextMatch(matcher),
      serializeTestingLibraryOptions(options)
    );

    if (cb) {
      await cb(element);
    } else {
      return element;
    }
  };
});

// Container settings shorthands:
[
  "ByRole",
  "ByLabelText",
  "ByPlaceholderText",
  "ByText",
  "ByDisplayValue",
  "ByAltText",
  "ByTitle",
  "ByTestId",
].forEach((queryFnNamePart) => {
  const containerSettingFnName = `setContainer${queryFnNamePart}`;
  const queryFnName = `tlFind${queryFnNamePart}`;

  testingLibraryModule[containerSettingFnName] = async function (
    containerName,
    ...rest
  ) {
    this.containerSet(containerName, async function () {
      const containerElem = await this[queryFnName](...rest);
      return containerElem;
    });
  };
});

module.exports = testingLibraryModule;
