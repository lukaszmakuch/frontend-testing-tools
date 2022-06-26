module.exports = {
  name: "container",
  methods: {
    set: async function (name, getter) {
      this._containerGetters = {
        ...(this._containerGetters ?? {}),
        [name]: getter,
      };
    },

    get: function (name) {
      const getter = this._containerGetters?.[name];
      if (!getter)
        throw new Error(
          `No function to fetch a "${name}" container has been registered.`
        );
      return getter.bind(this)();
    },
  },
};
