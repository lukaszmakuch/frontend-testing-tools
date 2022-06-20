const startEndpointImposter = require("start-endpoint-imposter");
const { rm, writeFile } = require("fs").promises;
var portastic = require("portastic");
const path = require("path");
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
    await rm(tmpDir, { recursive: true });
  };
  globalThis.__ENDPOINT_IMPOSTER_PORT__ = port;
  globalThis.__ENDPOINT_IMPOSTER_ROOT__ = `http://localhost:${port}`;
  globalThis.__STOP_ENDPOINT_IMPOSTER__ = stop;
  await writeFile(path.join(tmpDir, "eiEndpoint"), __ENDPOINT_IMPOSTER_ROOT__);
};
