# Frontend Testing Tools

Save thousands of dollars by employing pragmatic frontend tests developers enjoy writing!

Resources:

- 📄 [documentation](https://github.com/lukaszmakuch/frontend-testing-tools/wiki)
- 🎥 [a talk about frontend-testing-tools](https://m.youtube.com/watch?v=pKnonXe9Los&feature=youtu.be)

## What's the problem?

I've seen companies spend thousands of dollars on just setting up and fine-tuning their testing tools. I've seen developers work long hours just to implement the right assertions and mocks.

## What do I do about it?

I thought to myself, 'Wow! They really do care about doing a good job! They want to be professional! They don't want to disappoint their clients!'.

I know it's not an easy task, but I support people like that, because I too care about doing a good job. In the same time, as an IT consultant, I fight repetition and strive for cost-efficient processes I can quickly apply in various projects.

Wouldn't it be nice if you could just install an npm package and start developing tests of complex UIs?

That's why I created Frontend Testing Tools.

## What is this package?

What you’re looking at is a distribution of testing tools that work together well providing a synergetic effect. It’s years of my experience as a test-writing developer distilled into a single npm package.

## Whom is it for?

You need this toolbox if you want to:

- confidently develop the frontend even before the backend is ready
- test the problematic edge cases, such as 'What happens when this response arrives before that response?'
- automatically catch visual regression
- communicate with managers and other stakeholders easily by sending them screenshots illustrating every state of the app

## What does it consist of?

It's really just a glue code among smaller, battle-tested pieces of testing software. It provides a synergetic effect by combining:

- Kent C. Dodds' [Testing Library](https://testing-library.com) for natural, accessible selectors
- American Express' [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) because that's how you can make assertions regarding what your app actually renders on the screen
- Facebook's [Jest](https://jestjs.io/) which runs tests in parallel beautifully
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) because it's the rock-solid recommendation of W3C
- [Endpoint Imposter](https://endpoint-imposter.js.org/) for its ability to mock stateful APIs in a declarative manner

As you can see, it's a pragmatic collection that stands on the shoulders of giants.

## What it is not

It's equally important to understand what kind of problems a tool doesn't solve as it is to understand what it helps with.

Frontend Testing Tools won't help you with testing:

- performance
- security
- functions that are not related to frontend

## Whom is it for

It's for teams that want to develop frontend apps quicker by being able to parallelize the development of frontend and backend, automatically catch regression, and quickly test problematic edge cases.

## Whom is it not for

Let's be honest - using a tool just for the sake of using it may be detrimental to your team, as you'll be just burning cash.

You may not need Frontend Testing Tools if your team:

- honestly doesn't feel the need to automate testing, most probably because you already have a good enough system in place or you're facing some more pressing issues than bugs or the development process being slowed down by the frontend team waiting for the backend team
- consists of developers who rely solely on CI environments and don't want to develop tests themselves
