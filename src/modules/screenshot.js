const waitForExpect = require("wait-for-expect");
const sleep = require("sleep-promise");
const fs = require("fs");
const path = require("path");
const util = require("util");
const access = util.promisify(fs.access);

const SLEEP_BEFORE_UPDATING = 2000; // TODO: extract to an ENV variable
const SLEEP_BEFORE_CHECKING = 500; // TODO: extract to an ENV variable

function getPlatformShortcut() {
  switch (process.platform) {
    case "darwin":
      return "mac";
    case "linux":
      return "linux";
    case "win32":
      return "win";
    default:
      return "unknown";
  }
}

module.exports = {
  name: "screenshot",
  methods: {
    take: async function (id) {
      // Setting the app so that results are repeatable:
      await this.screenshotMakeCaretInvisible();
      await this.screenshotMakeTransitionsInstant();

      // Actually handling the screenshot matching:
      const customSnapshotIdentifier = id;

      const directory = path.resolve(
        path.dirname(testPath),
        "screenshots",
        await this.screenshotGetDeviceType()
      );
      const file = path.resolve(
        directory,
        `${customSnapshotIdentifier}-snap.png`
      );

      // It's true whenever we're forcefully updating existing snapshots,
      // as indicated by the UPDATING env variable or when this snapshot
      // hasn't been yet recorded.

      let screenshotExists = true;
      try {
        await access(file, fs.constants.F_OK);
      } catch {
        screenshotExists = false;
      }

      const isUpdating = updatingSnapshots || !screenshotExists;

      const timeout = 1000;
      const interval = 500;

      const testFn = async () => {
        const screenshot = await this.driver.takeScreenshot();
        expect(screenshot).toMatchImageSnapshot({
          failureThreshold: (await this.configRead()).screenshot
            .failureThreshold,
          failureThresholdType: (await this.configRead()).screenshot
            .failureThresholdType,

          // fixed params
          customSnapshotsDir: directory,
          customSnapshotIdentifier,
        });
      };

      if (isUpdating) {
        await sleep(SLEEP_BEFORE_UPDATING);
        await testFn();
      } else {
        await sleep(SLEEP_BEFORE_CHECKING);
        await waitForExpect(testFn, timeout, interval);
      }
    },

    getDeviceType: async function () {
      if (process.env.SCREENSHOT_DEVICE_TYPE)
        return process.env.SCREENSHOT_DEVICE_TYPE;

      return getPlatformShortcut() + "_x" + (await this.browserGetPixelRatio());
    },

    makeCaretInvisible: async function () {
      await this._styleInjectGlobal(`
        * {
          caret-color: transparent!important;
        }
      `);
    },

    makeTransitionsInstant: async function () {
      await this._styleInjectGlobal(`
        * {
          transition-duration: 0s!important;
        }
      `);
    },
  },
};
