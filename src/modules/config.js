const { set } = require("lodash");
const { read } = require("../config");

module.exports = {
  name: "config",
  methods: {
    read: async function () {
      await this.configLoadMutableIfNeeded();
      return this._mutableConfig;
    },

    override: async function (path, value) {
      await this.configLoadMutableIfNeeded();
      set(this._mutableConfig, path, value);
    },

    loadMutableIfNeeded: async function () {
      if (!this._mutableConfig) {
        this._mutableConfig = await read();
      }
    },
  },
};
