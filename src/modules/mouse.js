module.exports = {
    name: "mouse",
    methods: {
        hover: async function (element) {
            const actions = this.driver.actions({ async: true });
            await actions.move({ origin: element }).perform();
        },
    },
};
