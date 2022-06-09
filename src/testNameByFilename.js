const path = require("path");

function testNameByFilename({ filename }) {
  const { dir } = path.parse(filename);
  const dirParts = dir.split(path.sep);
  return (
    dirParts?.[dirParts.length - 2] + "-" + dirParts?.[dirParts.length - 1]
  );
}

module.exports = { testNameByFilename };
