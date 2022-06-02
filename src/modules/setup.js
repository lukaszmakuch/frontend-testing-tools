module.exports = {
  start: async function () {
    await this.driver.get(process.env.APP_ROOT_URL);
  },
  finish: async function () {
    await this.driver.executeScript(`
      window.continueRendering();
    `);
  },
};
