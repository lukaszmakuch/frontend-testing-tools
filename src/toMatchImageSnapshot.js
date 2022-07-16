const {
  toMatchImageSnapshot: baseToMatchImageSnapshot,
} = require("jest-image-snapshot");

const toMatchImageSnapshot = function (...args) {
  const customSnapshotIdentifier = args[1].customSnapshotIdentifier;
  const testName = this.currentTestName;
  const uniqScreenshotId = `${testName};${customSnapshotIdentifier}`;

  if (!this.snapshotState._runningScreenshots)
    this.snapshotState._runningScreenshots = {};
  if (!this.snapshotState._runningScreenshots[uniqScreenshotId])
    this.snapshotState._runningScreenshots[uniqScreenshotId] = false;

  const result = baseToMatchImageSnapshot.bind(this)(...args);

  const rerun = this.snapshotState._runningScreenshots[uniqScreenshotId];

  // just resetting what was initially set to make writing the code below easier
  if (!result.pass) this.snapshotState.unmatched--;

  if (rerun) {
    this.snapshotState._counters.set(
      testName,
      this.snapshotState._counters.get(testName) - 1
    );
    this.snapshotState.unmatched--;
    if (result.pass) this.snapshotState.matched++;
    if (!result.pass) this.snapshotState.unmatched++;
  } else {
    if (result.pass) this.snapshotState.matched++;
    if (!result.pass) this.snapshotState.unmatched++;
  }

  this.snapshotState._runningScreenshots[uniqScreenshotId] = true;
  return result;
};

module.exports = { toMatchImageSnapshot };
