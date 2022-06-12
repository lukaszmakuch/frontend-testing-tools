const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  testEnvironment:
    "../node_modules/frontend-testing-tools/src/jestEnvironment.js",
  setupFilesAfterEnv: [
    "../node_modules/frontend-testing-tools/src/setupFilesAfterEnv.js",
  ],
  globalSetup: "../node_modules/frontend-testing-tools/src/globalSetup.js",
  globalTeardown:
    "../node_modules/frontend-testing-tools/src/globalTeardown.js",
};
