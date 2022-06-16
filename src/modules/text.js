module.exports = {
  name: "text",
  methods: {
    click: async function (text) {
      await this.xpathClick(`//*[normalize-space(text())="${text}"]`); // TODO: escape
    },
  },
};
