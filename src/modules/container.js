module.exports = {
  set: async function (name, fn) {
    this._containerFetchingFns = {
      ...(this._containerFetchingFns ?? {}),
      [name]: fn,
    };
  },

  get: function (name) {
    const fn = this._containerFetchingFns?.[name];
    if (!fn)
      throw new Error(
        `No function to fetch a "${name}" containers has been registered.`
      );
    return fn.bind(this)();
  },
};
