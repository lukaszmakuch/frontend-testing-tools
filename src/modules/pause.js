const readline = require("node:readline/promises");
const process = require("node:process");

module.exports = {
  test: async function () {
    let rl;
    try {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      // TODO: kill it
      await rl.question("Press [Return] to continue.");
    } finally {
      rl.close();
    }
  },
};
