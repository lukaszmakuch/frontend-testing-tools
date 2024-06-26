const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

module.exports = {
  name: "browser",
  methods: {
    open: async function () {
      const options = new chrome.Options()
        .windowSize({
          width: (await this.configRead()).browser.default.width,
          height: (await this.configRead()).browser.default.height,
        })
        .addArguments("--force-color-profile=srgb")
        .addArguments("--user-agent=frontend-testing-tools")
        .addArguments('--cc-scroll-animation-duration-in-seconds=0')
        .addArguments('--disable-overscroll-edge-effect')
        .addArguments('--disable-smooth-scrolling')
        .addArguments('--hide-scrollbars');;

      if (!__IS_DEBUGGING__) {
        options.addArguments("--headless=new")
      }

      let driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

      await driver.sendDevToolsCommand("Emulation.setFocusEmulationEnabled", {
        enabled: true,
      });
      this.driver = driver;

      // await this.browserTriggerOnOpenListeners();

      this.teardownRegister(() => this.browserClose());
    },

    // addListenerOnOpen: function (fn) {
    //   this._browserListenersOnOpen = [
    //     ...(this._browserListenersOnOpen || []),
    //     fn,
    //   ];
    // },

    // triggerOnOpenListeners: async function () {
    //   const listeners = this._browserListenersOnOpen || [];
    //   for (let i = 0; i < listeners.length; i++) {
    //     await listeners[i]();
    //   }
    // },

    getPixelRatio: async function () {
      if (!this._cachedBrowserPixelRatio) {
        this._cachedBrowserPixelRatio = await this.driver.executeScript(
          "return window.devicePixelRatio;"
        );
      }

      return this._cachedBrowserPixelRatio;
    },

    close: async function () {
      await this.driver.quit();
    },
  },
};
