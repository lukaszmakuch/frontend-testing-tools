const { testNameByFilename } = require("./testNameByFilename");

test("extracting the test name", () => {
  const filename =
    "/Users/lukasz/projects/frontend-testing-tools/example-app/frontend-tests/todo_list/happy_path/test.js";
  expect(testNameByFilename({ filename })).toEqual("todo_list-happy_path");
});
