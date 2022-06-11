module.exports = {
  mock: async function (ISO) {
    const timestamp = +new Date(ISO);
    await this.driver.executeScript(
      `
        Date.now = () => arguments[0]
      `,
      timestamp
    );
  },
};
