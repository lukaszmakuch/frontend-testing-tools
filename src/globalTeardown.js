// your globalTeardown file, like jestGlobalTeardown.js

module.exports = async function () {
  await globalThis.__STOP_ENDPOINT_IMPOSTER__();
};
