const path = require("path");
const { mkdir } = require("node:fs/promises");

async function getTmpDir({ rootDir }) {
  const mockDirPath = path.resolve(rootDir, "_tmp");
  await mkdir(mockDirPath, { recursive: true });
  return mockDirPath;
}

module.exports = { getTmpDir };
