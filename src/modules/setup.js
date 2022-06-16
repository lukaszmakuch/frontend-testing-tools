module.exports = {
  name: "setup",
  methods: {
    start: async function () {
      await this.driver.get(process.env.APP_ROOT_URL);
    },
    finish: async function () {
      const errorMsg =
        "No _testContinueRendering function found while trying to finish the set up for testing purposes.";
      const finishedSetupSuccessfully = await this.driver.executeScript(`
        if (window._testContinueRendering) {
          window._testContinueRendering();
          return true;
        } else {
          console.error("${errorMsg}")
          return false;
        }
      `);
      if (!finishedSetupSuccessfully) console.error(errorMsg);
    },
  },
};
