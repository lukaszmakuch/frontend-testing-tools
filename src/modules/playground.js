const { initial, last } = require("lodash");

module.exports = {
  name: "playground",
  methods: {
    exec: async function (...allArgs) {
      const cb = last(allArgs);
      const args = initial(allArgs);
      await cb.bind(this)(...args);
    },
  },
};
