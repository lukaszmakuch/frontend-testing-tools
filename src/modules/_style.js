const crypto = require("crypto");

module.exports = {
  name: "_style",
  methods: {
    injectGlobal: async function (content) {
      const id =
        "testStyle" + crypto.createHash("md5").update(content).digest("hex");
      await this.driver.executeScript(
        function () {
          const { id, content } = arguments[0];
          if (!document.getElementById(id)) {
            const stylesheet = document.createElement("style");
            stylesheet.setAttribute("id", id);
            stylesheet.innerHTML = content;
            document.head.appendChild(stylesheet);
          }
        },
        { id, content }
      );
    },
  },
};
