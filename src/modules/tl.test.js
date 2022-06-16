const { unserializeTextMatch, serializeTextMatch } = require("./tl");

test("serializing string TextMatch objects", () => {
  const tm = unserializeTextMatch(serializeTextMatch("abc"));
  expect(tm).toEqual("abc");
});

test("serializing RegExp TextMatch objects", () => {
  const testRegExp = /aBc.*x/i;
  const tm = unserializeTextMatch(serializeTextMatch(testRegExp));

  expect(tm.test("abcQWEx")).toEqual(testRegExp.test("abcQWEx"));
  expect(tm.test("abcQWE")).toEqual(testRegExp.test("abcQWE"));
});

test("serializing undefined TextMatch objects", () => {
  expect(serializeTextMatch(undefined)).toBeUndefined();
});
