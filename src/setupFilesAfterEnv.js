const waitForExpect = require("wait-for-expect");
const { toMatchImageSnapshot } = require("./toMatchImageSnapshot");
const browserModule = require("./modules/browser");
const screenshotModule = require("./modules/screenshot");
const setupModule = require("./modules/setup");
const timeModule = require("./modules/time");
const teardownModule = require("./modules/teardown");
const makeEIModule = require("./modules/ei");

waitForExpect.defaults.timeout = 1100;
waitForExpect.defaults.interval = 10;

jest.setTimeout(5 * 60 * 1000);

console.log("setup files after env");

expect.extend({ toMatchImageSnapshot });

testCtx.swapModule("browser", browserModule);
testCtx.swapModule("screenshot", screenshotModule);
testCtx.swapModule("time", timeModule);
testCtx.swapModule("setup", setupModule);
testCtx.swapModule("teardown", teardownModule);
testCtx.swapModule("ei", makeEIModule());
