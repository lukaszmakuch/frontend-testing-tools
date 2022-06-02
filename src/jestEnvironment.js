const { makeTestExecutionContext } = require("./testExecutionContext");

const NodeEnvironment = require("jest-environment-node").default;

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    // console.log(config, context);

    this.global.updatingSnapshots =
      config.globalConfig.updateSnapshot === "all";
    this.global.testPath = context.testPath;
    // this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    // console.log(this.context.setTimeout);
    const testCtx = makeTestExecutionContext();
    this.global.testCtx = testCtx;
    // await someSetupTasks(this.testPath);
    // this.global.someGlobalObject = createGlobalObject();

    // Will trigger if docblock contains @my-custom-pragma my-pragma-value
    // if (this.docblockPragmas['my-custom-pragma'] === 'my-pragma-value') {
    // ...
    // }
  }

  async teardown() {
    // this.global.someGlobalObject = destroyGlobalObject();
    // await someTeardownTasks();

    const contexts = this.global.testCtx.getAllContexts();

    for (let i = 0; i < contexts.length; i++) {
      await contexts[i].teardownExecute();
    }
    await super.teardown();
  }

  // getVmContext() {
  //   return super.getVmContext();
  // }

  // async handleTestEvent(event, state) {
  //   if (event.name === 'test_start') {
  //     // ...
  //   }
  // }
}

module.exports = CustomEnvironment;
