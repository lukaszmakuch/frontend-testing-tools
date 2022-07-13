const { readFile } = require("node:fs/promises");
const path = require("path");

module.exports = {
  name: "time",
  methods: {
    installIfNeeded: async function () {
      const installed = await this.driver.executeScript(
        `
          return !!window._frontendTestingUtilsTimeTick;
        `
      );
      if (installed) return;

      const fakeTimeoutCode = await readFile(
        path.join(__dirname, "fakeTimeout.js"),
        "utf-8"
      );

      await this.driver.executeScript(
        `
          eval(arguments[0]);
          const { fakeSetTimeout, fakeClearTimeout, tick } = makeFakeTimeout({
            DateToUse: Date,
          });
          window.setTimeout = fakeSetTimeout;
          window.clearTimeout = fakeClearTimeout;
          window._frontendTestingUtilsTimeTick = tick;
        `,
        fakeTimeoutCode
      );
    },

    tick: async function () {
      await this.driver.executeScript(
        `
          window._frontendTestingUtilsTimeTick();
        `
      );
    },

    mock: async function (ISO) {
      await this.timeInstallIfNeeded();

      const timestamp = +new Date(ISO);
      await this.driver.executeScript(
        `
          Date.now = () => arguments[0];
        `,
        timestamp
      );
      await this.timeTick();
    },
  },
};
