module.exports = {
  name: "playground",
  methods: {
    exec: async function (cb) {
      await cb.bind(this)();
    },
  },
};
