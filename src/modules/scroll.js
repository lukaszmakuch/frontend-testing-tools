module.exports = {
    name: "scroll",
    methods: {
        down: async function (pixels) {
            // This used to work, but some time between Chrome 110 and 120 it started behaving in an unpredictable way.
            // await this.driver.actions().scroll(0, 0, 0, pixels).perform();

            // That's why we use JS now, as it is more predictable.
            await this.driver.executeScript(
                function () {
                    const { pixels } = arguments[0];
                    window.scrollBy({
                        top: pixels,
                        left: 0,
                        behavior: "instant",
                    });
                },
                { pixels }
            );
        },
    },
};
