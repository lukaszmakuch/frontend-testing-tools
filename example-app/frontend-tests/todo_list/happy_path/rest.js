const { step, scenario } = require("endpoint-imposter-utils");

module.exports = [
  ...scenario("adding-items", [
    ...step("start", [
      {
        request: { method: "GET", path: "/items" },
        releaseOn: "items",
        response: {
          json: [
            { value: "a", id: 1 },
            { value: "b", id: 2 },
            { value: "c", id: 3 },
          ],
        },
      },

      {
        request: { path: "/pingPong" },
        response: {
          status: 200,
        },
      },

      {
        afterResponse: "added",
        releaseOn: "adding",
        request: {
          method: "POST",
          path: "/item",
          body: { content: "new item" },
        },
        response: { status: 204 },
      },
    ]),
    ...step("added", [
      {
        scenario: "adding-items",
        step: "added",
        request: { method: "GET", path: "/items" },
        response: {
          json: [
            { value: "a", id: 1 },
            { value: "b", id: 2 },
            { value: "c", id: 3 },
            { value: "new item", id: 4 },
          ],
        },
      },
    ]),
  ]),
];
