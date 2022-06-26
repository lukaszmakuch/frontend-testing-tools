const readline = require("node:readline/promises");
const process = require("node:process");

module.exports = {
  name: "pause",
  methods: {
    test: async function () {
      if (!__IS_DEBUGGING__) return;

      let rl;
      try {
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        await rl.question("Press [Return] to continue.");
      } finally {
        rl.close();
      }
    },
  },
};
