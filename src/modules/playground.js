module.exports = {
  exec: async function (cb) {
    await cb.bind(this)();
  },
};
