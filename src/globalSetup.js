const waitForExpect = require("wait-for-expect");

waitForExpect.defaults.timeout = 1100;
waitForExpect.defaults.interval = 10;

jest.setTimeout(5 * 60 * 1000);

const {
  toMatchImageSnapshot: baseToMatchImageSnapshot,
} = require("jest-image-snapshot");

const toMatchImageSnapshot = function (...args) {
  const customSnapshotIdentifier = args[1].customSnapshotIdentifier;
  const testName = this.currentTestName;
  const uniqScreenshotId = `${testName};${customSnapshotIdentifier}`;
  // console.log("customSnapshotIdentifier", customSnapshotIdentifier);

  if (!this.snapshotState._runningScreenshots)
    this.snapshotState._runningScreenshots = {};
  if (!this.snapshotState._runningScreenshots[uniqScreenshotId])
    this.snapshotState._runningScreenshots[uniqScreenshotId] = false;

  // console.log('here')

  const result = baseToMatchImageSnapshot.bind(this)(...args);
  // console.log("result", result);

  const rerun = this.snapshotState._runningScreenshots[uniqScreenshotId];

  // see https://github.com/americanexpress/jest-image-snapshot/pull/257
  if (!result.updated && !result.added) this.snapshotState.matched--;

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

  // console.log("state", this.snapshotState)
  // console.log("result", result)

  this.snapshotState._runningScreenshots[uniqScreenshotId] = true;
  return result;
};

expect.extend({ toMatchImageSnapshot });
