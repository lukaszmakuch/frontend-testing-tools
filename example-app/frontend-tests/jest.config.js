const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  testEnvironment:
    "../node_modules/frontend-testing-utils/src/jestEnvironment.js",
  setupFilesAfterEnv: [
    "../node_modules/frontend-testing-utils/src/setupFilesAfterEnv.js",
  ],
  globalSetup: "../node_modules/frontend-testing-utils/src/globalSetup.js",
  globalTeardown:
    "../node_modules/frontend-testing-utils/src/globalTeardown.js",
};
