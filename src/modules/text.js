module.exports = {
  click: async function (text) {
    await this.xpathClick(`//*[normalize-space(text())="${text}"]`); // TODO: escape
  },
};
