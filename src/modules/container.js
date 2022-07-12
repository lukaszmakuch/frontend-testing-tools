module.exports = {
  name: "container",
  methods: {
    set: async function (containerElement, name) {
      this._containers = {
        ...(this._containers ?? {}),
        [name]: containerElement,
      };
    },

    get: function (name) {
      const container = this._containers?.[name];
      if (!container)
        throw new Error(
          `No container with the name "${name}" has been declared.`
        );
      return container;
    },
  },
};
