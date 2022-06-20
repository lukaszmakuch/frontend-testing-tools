module.exports = {
  name: "container",
  methods: {
    set: async function (name, setter) {
      this._containerSetters = {
        ...(this._containerSetters ?? {}),
        [name]: setter,
      };
    },

    get: function (name) {
      const setter = this._containerSetters?.[name];
      if (!setter)
        throw new Error(
          `No function to fetch a "${name}" containers has been registered.`
        );
      return setter.bind(this)();
    },
  },
};
