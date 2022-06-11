const { By, until } = require("selenium-webdriver");

module.exports = {
  query: async function (xpathQuery, cb) {
    const found = this.driver.wait(
      until.elementLocated(By.xpath(xpathQuery)),
      15000
    ); // TODO: parametrize
    if (cb) await cb(found);
    return found;
  },
  click: async function (xpathQuery) {
    (await this.xpathQuery(xpathQuery)).click(); // TODO: use "self" once we have it
  },
};
