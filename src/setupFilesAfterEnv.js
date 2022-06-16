const waitForExpect = require("wait-for-expect");
const { toMatchImageSnapshot } = require("./toMatchImageSnapshot");
const browserModule = require("./modules/browser");
const screenshotModule = require("./modules/screenshot");
const setupModule = require("./modules/setup");
const timeModule = require("./modules/time");
const teardownModule = require("./modules/teardown");
const makeEIModule = require("./modules/ei");
const xpathModule = require("./modules/xpath");
const textModule = require("./modules/text");
const pauseModule = require("./modules/pause");
const configModule = require("./modules/config");
const playgroundModule = require("./modules/playground");
const tlModule = require("./modules/tl");
const containerModule = require("./modules/container");

// TODO: parametrize these three
waitForExpect.defaults.timeout = 1100;
waitForExpect.defaults.interval = 10;
jest.setTimeout(5 * 60 * 1000);

expect.extend({ toMatchImageSnapshot });

testCtx.swapModule("browser", browserModule);
testCtx.swapModule("screenshot", screenshotModule);
testCtx.swapModule("time", timeModule);
testCtx.swapModule("setup", setupModule);
testCtx.swapModule("teardown", teardownModule);
testCtx.swapModule("ei", makeEIModule());
testCtx.swapModule("xpath", xpathModule);
testCtx.swapModule("text", textModule);
testCtx.swapModule("pause", pauseModule);
testCtx.swapModule("config", configModule);
testCtx.swapModule("playground", playgroundModule);
testCtx.swapModule("tl", tlModule);
testCtx.swapModule("container", containerModule);
