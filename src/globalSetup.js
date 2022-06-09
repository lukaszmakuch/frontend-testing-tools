const startEndpointImposter = require("start-endpoint-imposter");
const { unlink, rmdir } = require("node:fs/promises");
var portastic = require("portastic");
const { locateMockFiles, createEntryPointFile } = require("./mocks");
const { getTmpDir } = require("./tmpdir");

module.exports = async (globalConfig) => {
  const rootDir = globalConfig.rootDir;

  const mockFiles = await locateMockFiles({ rootDir });

  const { mocksEntryPointFile } = await createEntryPointFile({
    rootDir,
    mockFiles,
  });
  const tmpDir = await getTmpDir({ rootDir });

  const [port] = await portastic.find({
    min: 5000,
    max: 7999,
  });

  const stopEI = await startEndpointImposter({
    "--port": port,
    "--mocks": mocksEntryPointFile,
  });

  const stop = async () => {
    await stopEI();
    await unlink(mocksEntryPointFile);
    await rmdir(tmpDir);
  };
  global.__ENDPOINT_IMPOSTER_PORT__ = port;
  global.__ENDPOINT_IMPOSTER_ROOT__ = `http://localhost:${port}`;
  global.__STOP_ENDPOINT_IMPOSTER__ = stop;
};
