const { readFile } = require("node:fs/promises");
const path = require("path");

test("fakeTimeout", async () => {
  eval(await readFile(path.join(__dirname, "fakeTimeout.js"), "utf-8"));
  console.log(makeFakeTimeout);

  const DateToUse = {};
  const mockNow = (timestamp) => {
    DateToUse.now = () => timestamp;
  };

  const { fakeSetTimeout, fakeClearTimeout, tick } = makeFakeTimeout({
    DateToUse,
  });

  mockNow(1000);

  let log = [];
  const loggerCb = (toLog) => () => log.push(toLog);

  fakeSetTimeout(loggerCb("zero"), 0);
  tick();
  tick();
  tick();

  expect(log).toEqual(["zero"]);

  fakeClearTimeout(fakeSetTimeout(loggerCb("canceled zero"), 0));

  tick();
  tick();
  tick();

  expect(log).toEqual(["zero"]);

  fakeSetTimeout(loggerCb("1.1"), 10);
  fakeSetTimeout(loggerCb("1.2"), 10);
  fakeSetTimeout(loggerCb("2"), 20);

  tick();
  tick();
  tick();

  expect(log).toEqual(["zero"]);

  mockNow(1010);
  tick();

  expect(log).toEqual(["zero", "1.1", "1.2"]);

  mockNow(1030);
  tick();

  expect(log).toEqual(["zero", "1.1", "1.2", "2"]);
});
