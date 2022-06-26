const { By, until } = require("selenium-webdriver");

module.exports = {
  name: "xpath",
  methods: {
    query: async function (xpathQuery, cb) {
      const found = this.driver.wait(
        until.elementLocated(By.xpath(xpathQuery)),
        15000
      );
      if (cb) await cb(found);
      else return [found];
    },
  },
};
