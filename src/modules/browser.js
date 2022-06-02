const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { Builder } = require("selenium-webdriver");
require("chromedriver");

module.exports = {
  open: async function () {
    let driver = new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options().windowSize({ width: 1024, height: 700 })
      )
      .build();
    this.driver = driver;

    console.log("starting the browser");
  },
  close: async function () {
    try {
      await this.driver.quit();
    } catch {}
  },
};
