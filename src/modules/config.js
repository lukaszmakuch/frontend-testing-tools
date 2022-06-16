const { read } = require("../config");

module.exports = {
  name: "config",
  methods: {
    read: function () {
      return read();
    },
  },
};
