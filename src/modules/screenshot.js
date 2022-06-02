const waitForExpect = require("wait-for-expect");
const sleep = require("sleep-promise");
const fs = require("fs");
const path = require("path");
const util = require("util");
const access = util.promisify(fs.access);

const SLEEP_BEFORE_UPDATING = 2000; // TODO: extract to an ENV variable
const SLEEP_BEFORE_CHECKING = 500; // TODO: extract to an ENV variable

module.exports = {
  take: async function (id) {
    const customSnapshotIdentifier = id;

    const directory = path.resolve(path.dirname(testPath), "screenshots");
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
        // TODO: allow these to be configured
        customSnapshotsDir: directory,
        failureThreshold: 0.0001,
        failureThresholdType: "percent",
        customSnapshotIdentifier,
      });
    };

    if (isUpdating) {
      console.log("updating snapshot");
      await sleep(SLEEP_BEFORE_UPDATING);
      await testFn();
    } else {
      await sleep(SLEEP_BEFORE_CHECKING);
      await waitForExpect(testFn, timeout, interval);
    }
  },
};
