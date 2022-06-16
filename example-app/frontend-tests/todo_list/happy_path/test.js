test(
  NAME,
  () =>
    testCtx[0]
      .browserOpen()
      .setupStart()
      .eiUse()
      .setupFinish()
      .tlFindByRole(/b.tton/, { name: /DD/i }, async (button) => {
        console.log(button);
      })
      .playgroundExec(async function () {})
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
