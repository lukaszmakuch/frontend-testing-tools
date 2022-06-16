test(
  NAME,
  () =>
    testCtx[0]
      .browserOpen()
      .setupStart()
      .eiUse()
      .setupFinish()

      // .tlFindByRole(/b.tton/, { name: /DD/i }, async (button) => {
      //   console.log(button);
      // })
      // .containerSet("form", () => testCtx[0].tlFindByTestId("myForm"))
      .tlSetContainerByTestId("form", "myForm")

      .playgroundExec(async function () {
        console.log({
          fetched: await testCtx[0].tlFindByText("form", /a(D{2,3})/i),
          // container: await testCtx[0].containerGet("form"),
        });
      })
      // .screenshotTake("loadingItems")
      .pauseTest()
  // .eiRelease("items")
  // .eiExpectOk("/pingPong")
  // .screenshotTake("myFirstScreen")
  // .xpathQuery('//*[@placeholder="TYPE HERE"]', (input) =>
  //   input.sendKeys("new item")
  // )
  // .screenshotTake("typed")
  // .textClick("add")
  // .screenshotTake("adding")
  // .eiRelease("adding")
  // .eiRelease("items")
  // .screenshotTake("added")
);
