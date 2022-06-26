const waitForExpect = require("wait-for-expect");
const { toMatchImageSnapshot } = require("./toMatchImageSnapshot");
const browserModule = require("./modules/browser");
const screenshotModule = require("./modules/screenshot");
const setupModule = require("./modules/setup");
const timeModule = require("./modules/time");
const teardownModule = require("./modules/teardown");
const makeEIModule = require("./modules/ei");
const xpathModule = require("./modules/xpath");
const pauseModule = require("./modules/pause");
const configModule = require("./modules/config");
const playgroundModule = require("./modules/playground");
const tlModule = require("./modules/tl");
const containerModule = require("./modules/container");
const clickModule = require("./modules/click");

// TODO: parametrize these three
waitForExpect.defaults.timeout = 1100;
waitForExpect.defaults.interval = 10;
jest.setTimeout(5 * 60 * 1000);

expect.extend({ toMatchImageSnapshot });

testCtx.swapModule(browserModule);
testCtx.swapModule(screenshotModule);
testCtx.swapModule(timeModule);
testCtx.swapModule(setupModule);
testCtx.swapModule(teardownModule);
testCtx.swapModule(makeEIModule());
testCtx.swapModule(xpathModule);
testCtx.swapModule(pauseModule);
testCtx.swapModule(configModule);
testCtx.swapModule(playgroundModule);
testCtx.swapModule(tlModule);
testCtx.swapModule(containerModule);
testCtx.swapModule(clickModule);
