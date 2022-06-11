module.exports = {
  browser: {
    default: {
      width: 1024, // the width of the browser
      height: 700, // the height of the browser
    },
  },
  screenshot: {
    comparisonOptions: {
      // exactly as described at https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api
      failureThreshold: 0.0001,
      failureThresholdType: "percent",
    },
  },
};
