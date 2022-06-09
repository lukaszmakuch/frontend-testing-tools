var glob = require("glob");
const tmp = require("tmp");
const path = require("path");
const escodegen = require("escodegen");
const { testNameByFilename } = require("./testNameByFilename");
const { writeFile, mkdir } = require("node:fs/promises");
const { getTmpDir } = require("./tmpdir");

function fillInEntryPointSourceTemplate({ arrayOfMocksSrc }) {
  return `
  const { allowAllCORSOrigins, pathPrefix } = require('endpoint-imposter-utils');
  const arrayOfMocks = ${arrayOfMocksSrc}
    module.exports = allowAllCORSOrigins(arrayOfMocks);
  `;
}

function generateEntryPointSource({ mockFiles }) {
  const mockFilesWithPrefixes = mockFiles.map((path) => ({
    path,
    prefix: testNameByFilename({ filename: path }),
  }));

  // built based on https://esprima.org/demo/parse.html
  const arrayOfMocksAST = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "ArrayExpression",
          elements: mockFilesWithPrefixes.map(({ path, prefix }) => {
            return {
              type: "SpreadElement",
              argument: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "pathPrefix",
                },
                arguments: [
                  {
                    type: "Literal",
                    value: prefix,
                    raw: "'" + prefix + "'",
                  },
                  {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "require",
                    },
                    arguments: [
                      {
                        type: "Literal",
                        value: path,
                        raw: "'" + path + "'",
                      },
                    ],
                  },
                ],
              },
            };
          }),
        },
      },
    ],
    sourceType: "script",
  };

  const arrayOfMocksSrc = escodegen.generate(arrayOfMocksAST);
  return fillInEntryPointSourceTemplate({
    arrayOfMocksSrc,
  });
}

async function createEntryPointFile({ mockFiles, rootDir }) {
  const mockDirPath = await getTmpDir({ rootDir });
  const mocksEntryPointFile = path.resolve(mockDirPath, "mocks.js");
  const entryPointSrc = generateEntryPointSource({ mockFiles });
  await writeFile(mocksEntryPointFile, entryPointSrc, "utf8");
  return { mocksEntryPointFile };
}

async function locateMockFiles({ rootDir }) {
  const files = new Promise((resolve, reject) => {
    glob(
      "**/rest.js",
      {
        root: rootDir,
        nonull: false,
        ignore: ["node_modules/**/*"],
        absolute: true,
      },
      function (er, result) {
        if (er) return reject(er);
        resolve(result);
      }
    );
  });
  return files;
}

module.exports = {
  locateMockFiles,
  createEntryPointFile,
  generateEntryPointSource,
};
