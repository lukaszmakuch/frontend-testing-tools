module.exports = {
  name: "_style",
  methods: {
    injectGlobal: async function ({ id, content }) {
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
