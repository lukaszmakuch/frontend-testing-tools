const { Key } = require("selenium-webdriver");

module.exports = {
  name: "input",
  methods: {
    clear: async (inputElem) => {
      while ((await inputElem.getAttribute("value")) !== "") {
        await inputElem.sendKeys(Key.BACK_SPACE);
      }
    },

    typeMore: async (inputElem, text) => {
      await inputElem.sendKeys(text);
    },

    type: async function (inputElem, text) {
      await this.inputClear(inputElem);
      await this.inputTypeMore(inputElem, text);
    },
  },
};
