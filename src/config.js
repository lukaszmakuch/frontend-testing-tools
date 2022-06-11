var merge = require("lodash/merge");
const path = require("path");
const defaultConfig = require("./defaultConfig");

function read() {
  const pacakgeJsonOverrides =
    require(path.resolve(process.cwd(), "package.json"))?.[
      "frontend-testing-utils"
    ] ?? {};
  return merge(defaultConfig, pacakgeJsonOverrides);
}

module.exports = {
  read,
};
