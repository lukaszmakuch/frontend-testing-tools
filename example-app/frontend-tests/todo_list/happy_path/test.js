test(NAME, () =>
  testCtx[0]
    .browserOpen()
    .setupStart()
    .eiUse()
    .setupFinish()
    .timeMock("04 Dec 1995 00:12:00 GMT")
    // .pauseTest()
    .timeMock("04 Dec 1995 00:12:01 GMT")
    // .pauseTest()
    .timeMock("04 Dec 1995 00:12:10 GMT")
    // .pauseTest()

    .tlFindByTestId("myForm")
    .containerSet("form")

    .tlFindByRole("form", /b.tton/, { name: /DD/i })
    .playgroundExec((foundElement) => console.log(foundElement))
    .pauseTest()
    .tlFindByRole("form", /b.tton/, { name: /DD/i }, async (button) => {
      console.log(button);
    })

    .playgroundExec(async function () {
      console.log({
        fetched: await testCtx[0].tlFindByText("form", /a(D{2,3})/i),
      });
    })
    .screenshotTake("loadingItems")
    // .pauseTest()
    .eiRelease("items")
    .tlFindByText("form", "add", (e) => {})
    .eiExpectOk("/pingPong")
    .screenshotTake("myFirstScreen")
    // .pauseTest()
    .xpathQuery('//*[@placeholder="TYPE HERE"]', (input) =>
      input.sendKeys("new item")
    )
    .screenshotTake("typed")
    .tlFindByText("form", "add")
    .clickIt()
    .screenshotTake("adding")
    .eiRelease("adding")
    .eiRelease("items")
    .screenshotTake("added")
);
