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

    await driver.sendDevToolsCommand("Emulation.setFocusEmulationEnabled", {
      enabled: true,
    });
    this.driver = driver;
    this.teardownRegister(() => this.browserClose());
  },
  close: async function () {
    await this.driver.quit();
  },
};
