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
const path = require("path");
const { readFile } = require("node:fs/promises");
const waitForExpect = require("wait-for-expect");

function isTextMatch(maybeTextMatch) {
  return isRegExp(maybeTextMatch) || isString(maybeTextMatch);
}

// Serialized so that we can pass RegExps from this test via selenium to the browser.
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
  name: "tl",

  serializeTextMatch,
  unserializeTextMatch,

  methods: {
    isInstalled: async function () {
      return await this.driver.executeScript(`
        return !!window.TestingLibraryDom
      `);
    },

    installIfNeeded: async function () {
      if (await this.tlIsInstalled()) return;

      const testingLibrarySource = await readFile(
        path.resolve(
          path.dirname(require.resolve("@testing-library/dom")),
          "@testing-library/dom.umd.min.js"
        ),
        "utf-8"
      );

      await this.driver.executeScript(
        `
        var testingLibraryScriptElement = document.createElement("script");
        testingLibraryScriptElement.setAttribute("src", URL.createObjectURL(
          new File(
            [arguments[0]],
            "dom-testing-library.js",
            { type: "text/plain" }
          )
        )); 
        testingLibraryScriptElement.setAttribute("type", "text/javascript"); 
        document.head.appendChild(testingLibraryScriptElement);
  
        window.unserializeTextMatch = ${unserializeTextMatch};
        window.unserializeTestingLibraryOptions = ${unserializeTestingLibraryOptions};
      `,
        [testingLibrarySource]
      );

      await waitForExpect(async () => {
        const notInstalled = await this.driver.executeScript(`
          return typeof(window.TestingLibraryDom) === "undefined";
        `);
        if (notInstalled) throw new Error("Testing Library not installed");
      });
    },
  },
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
  testingLibraryModule.methods[queryFnName] = async function (...args) {
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

  testingLibraryModule.methods[containerSettingFnName] = async function (
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
