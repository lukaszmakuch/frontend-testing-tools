module.exports = {
  browser: {
    default: {
      /*
        These are dimensions of the actual window that will pop-up on your screen.
        Bear in mind that your teammates may use monitors that differ from yours. 
        For example, even if you rock a 6K screen and can accommodate a 3000x1500px@2 browser window,
        one of your colleagues may be working on a 13 MBP set to 1280x800px@2.
        It may be a good idea then to configure the browser window to be as big as possible but not
        bigger than the smallest screen in your team. In this case, it could be a comfortable 1024x700.
        Don't worry, you'll still be able to take screenshots bigger than your screen.
      */
      width: 1024, // the width of the browser
      height: 700, // the height of the browser
    },
  },
  screenshot: {
    /*
      If you want, pass here the parameters of the device to emulate. 
      They are described here https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setDeviceMetricsOverride
      You may need them if you want to take screenshots bigger than the size of the browser
      or if you'd like to use a pixel density different than the one of your screen.
      While a project-wide setting may work for most of your screenshots,
      sometimes it makes sense to locally override the settings just for a particular test case.
      Let's say there's a test case that renders more elements than most of the other test cases.
      If you override the device metrics for that particular test case,
      you can fit all the important elements in the screenshots,
      and in the same time all the other screenshots aren't overly big, thus mostly empty.
      
      For example:
      .configOverride("screenshot.deviceMetrics", {
        width: 1500,
        height: 5000,
        deviceScaleFactor: 2,
        mobile: false,
      })
      .screenshotTake("computed")
    */
    deviceMetrics: null,
    comparisonOptions: {
      // Exactly as described at https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api
      // You'll rarely need to override the comparisonOptions key.
      comparisonMethod: "ssim",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    },
  },
};
