module.exports = {
  name: "teardown",
  methods: {
    register: function (cb) {
      if (!this.registeredTeardownCallbacks) {
        this.registeredTeardownCallbacks = [];
      }

      const cbThatDoesntThrow = async () => {
        try {
          await cb();
        } catch (e) {
          console.warn("An error occurred during the teardown phase", e);
        }
      };

      this.registeredTeardownCallbacks.push(cbThatDoesntThrow);
    },

    execute: async function () {
      const cbs = this.registeredTeardownCallbacks || [];
      for (let i = 0; i < cbs.length; i++) {
        await cbs[i]();
      }
    },
  },
};
