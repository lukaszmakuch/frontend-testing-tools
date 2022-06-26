const { makeTestExecutionContext } = require("./testExecutionContext");

describe("test execution context", () => {
  it("blahs", async () => {
    const testCtx = makeTestExecutionContext();

    let printed = [];

    const producerModule = {
      name: "producer",
      methods: {
        get42: function () {
          return [42, "hi there, "];
        },
      },
    };

    const consumerModule = {
      name: "consumer",
      methods: {
        print: function (value, prefix) {
          printed.push(prefix + "the value is " + value);
        },
      },
    };

    testCtx.swapModule(producerModule);
    testCtx.swapModule(consumerModule);

    await testCtx[0].producerGet42().consumerPrint();

    expect(printed).toEqual(["hi there, the value is 42"]);
  });

  it("allows chaining", async () => {
    const testCtx = makeTestExecutionContext();

    const valueSetterModule = {
      name: "set",
      methods: {
        value: async function (key, value) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          this["_" + key] = value;
        },

        upperCasedValue: async function (key, srcKey) {
          const toTransform = await this.readValue(srcKey);
          return this.setValue(key, await this.uppercaseString(toTransform));
        },

        namePrefixedValue: async function (key, value) {
          return this.setValue(key, (await this.readValue("name")) + value);
        },
      },
    };

    const valueReadingModule = {
      name: "read",
      methods: {
        value: function (key) {
          return this["_" + key];
        },
      },
    };

    let printed = [];
    const printer = {
      name: "print",
      methods: {
        value: async function (key) {
          printed.push(await this.readValue(key));
        },
      },
    };

    const upperCaseModule = {
      name: "uppercase",
      methods: {
        string: function (string) {
          return string.toUpperCase();
        },
      },
    };

    testCtx.swapModule(valueSetterModule);
    testCtx.swapModule(valueReadingModule);
    testCtx.swapModule(printer);
    testCtx.swapModule(upperCaseModule);

    // const c1 = testCtx[0];
    // const c2 = testCtx[1];
    const [c1, c2] = testCtx;

    const message = await c1
      .setValue("nameVal", "joe")
      // .setValue("name", c1.uppercaseString("nameVal"));
      .setUpperCasedValue("name", "nameVal")
      .setNamePrefixedValue("message", ", hi man!")
      .readValue("message");

    expect(message).toEqual("JOE, hi man!");

    await c2.setValue("msg", message).printValue("msg");

    expect(printed).toEqual(["JOE, hi man!"]);

    expect(new Set([c1, c2])).toEqual(new Set(testCtx.getAllContexts()));
  });
});
