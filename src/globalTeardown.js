// your globalTeardown file, like jestGlobalTeardown.js

module.exports = async function () {
  await global.__STOP_ENDPOINT_IMPOSTER__();
};
