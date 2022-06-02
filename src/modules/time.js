module.exports = {
  mock: async function (ISO) {
    const timestamp = +new Date(ISO);
    await this.driver.executeScript(`mockTime(arguments[0])`, timestamp);
  },
};
