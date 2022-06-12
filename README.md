# Frontend Testing Utils

WIP

## Setting up the app

Jest config:

```
const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  testEnvironment:
    "../node_modules/frontend-testing-tools/src/jestEnvironment.js",
  setupFilesAfterEnv: [
    "../node_modules/frontend-testing-tools/src/setupFilesAfterEnv.js",
  ],
  globalSetup: "../node_modules/frontend-testing-tools/src/globalSetup.js",
  globalTeardown:
    "../node_modules/frontend-testing-tools/src/globalTeardown.js",
};

```

The app's entry point:

```
window._testSetHttpApiUrl = function (url) {
  window.API_ROOT = url;
};

window._testContinueRendering = function () {
  root.render(toRender);
};
if (!/frontend-testing-tools/.test(navigator.userAgent))
  window._testContinueRendering();
```

## An example test:

```
test(NAME, () =>
  testCtx[0]
    .browserOpen()
    .setupStart()
    .eiUse()
    .setupFinish()
    .screenshotTake("loadingItems")
    .eiRelease("items")
    .eiExpectOk("/pingPong")
    .screenshotTake("myFirstScreen")
    .xpathQuery('//*[@placeholder="TYPE HERE"]', (input) =>
      input.sendKeys("new item")
    )
    .screenshotTake("typed")
    .textClick("add")
    .screenshotTake("adding")
    .eiRelease("adding")
    .eiRelease("items")
    .screenshotTake("added")
);

```

## Configuration:

You can specify global options in the package.json file like that:

```
"frontend-testing-tools": {
  "browser": {
    "default": {
      "width": 1024,
      "height": 700
    }
  }
}
```

A complete list of available parameters, their descriptions and default values can be found in the [src/defaultConfig.js](./src/defaultConfig.js) file.

Environmental variables:

- `SCREENSHOT_DEVICE_TYPE` overrides the destination folder of screenshots, such as "mac_x2" or "linux_x1"
