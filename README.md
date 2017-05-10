# implementing-feature-with-tests

## Why bother with tests?

The value of production code is unquestionable. It brings to live features, that make up a product. The value of test code on the other hand is less obvious. At any given moment all of it can be thrown away but the product will remain the same. So why bother?

This may be obvious, but let’s see what happens after all tests have been removed. The next code change that accidentally breaks any of the existing functionality will do so quietly without ringing any bells or whistles. It is only when that change is shipped into production that somebody is going to notice and that somebody is likely to be the end user. And so the developers will learn about the problem quite some time after it's been introduced. At the point where more code has been layered on top of the broken code and fixing the original problem will therefor require a lot more effort. Let alone fixing potential data problems. Not to mention unhappy users.

This is an expensive feedback cycle. Now if only there was a way to learn about the problem somewhat earlier? Ideally before the code is shipped anywhere or even leaves the developer's machine? You guessed it. That's where the test code comes into play. Running tests locally takes minutes and because it takes minutes developers can do this often, checking every small change.

To put it another way, if production code represents features, test code represents the ability to add more features. On projects that keep changing over time (e.g. web applications) both are essential.

But the value of tests doesn't actually stop there. If developed using TDD, they also _drive_ the internal system architecture. Since the interfaces between components have to be designed and thought through before they’re implemented. This is also known as 'outside in’. Where ‘outside' is the interface and ‘in’ is the implementation.

TDD is a hard sell though. The idea is slightly more abstract than simply ‘keep existing code from breaking’. It requires more effort to adapt (writing tests _first_ may feel very alien to begin with) and more discipline to adhere. And also there are plenty of folks out there who aren't convinced about the whole thing anyway. So I am going to leave it there and keep this post focused on more immediately practical testing whose usefulness is hopefully obvious to everyone.

## Ok. But how?

We've established that tests are essential. Now how do we go about writing them? This is a popular question, but it's also a bit misleading. Tests aren't there for the sake of it, nor they're written by someone else, so the question should really be put more broadly: how do we build software with tests?

In an ideal scenario, each feature is implemented and delivered separately. Code that implements it is a combination of production and test code. So the above question can be simplified into 'how do we build a feature with tests?' And since I am running out of pre canned trivia, let's just look at the example.

## Let’s look at some code.

We've just joined a team that works on a task list application. Out client is the villain from [Black Mirror S3E3](http://www.imdb.com/title/tt5709230/). Following their initial success, they figured that a messaging app is not the best way to setup and follow the progress of victims’ tasks. Instead, they’re planning to be sending victims unique links to the their personal task lists.

At this point, the app is already showing tasks. Our first assignment is to add the ability to mark them complete.

Where to begin? The very first thing to do is to make sure we understand what needs to be done, who needs it and why. I am going to explain the benefits of doing this later, but certainly better understanding can’t hurt, can it? And even if it is a waste of time, it is a small one, since aren't even writing any code.

A good way to understand something is to write it down. This way it can also be shared with others and preserved in source control. So let's write it down:

_"As a victim, I need a very simple way to communicate the completion of a task. So that, as stressed as I am, I am less likely to mess it up."_

Since we’re on it, let’s also write an example of how someone would use this feature:

_"Given Alice is tasked to deliver a cake to an address, when she delivers it, then she can cross this task off the list and Bob the Villain gets notified"_

Interestingly, this little exercise revealed a detail that was missing in the original description: villain needs to be notified. Also, the "mess it up" bit, though less likely, is still going to be happening. So, clearly, there is some extra work needed to make sure they can undo the task completion. Which can be captured in another example:

_"Given Alice is tasked to deliver a cake to an address, when she accidentally marks it complete, then she can undo it and Bob the Villain gets notified both times"_

Just like that, at the cost of only few sentences (and no code at all) we've uncovered important changes. In a way, this is the first deliverable. We can now go back to the client with more questions, updated estimates and more detailed list of what is going to change. And give them a chance to perhaps reevaluate before any work has begun.

This is why understanding the feature and documenting it is such a good start. Loading up the high level context in your brain often brings up important questions early. Those questions will still pop up later anyway. Except later means there is already some code written that isn't addressing them or addressing some assumptions that turned out not to be true. This is a danger zone. It is too tempting to bend that code into kinda doing the right thing rather than throwing it away and do just the right thing.

As useful as our little script is, there is no guarantee that at any point now or in the future the system is (still) doing what it is supposed to. If only we could somehow actually execute that script to verify the behavior.

Meet [Cucumber](https://github.com/cucumber/cucumber-js) - "a tool for running automated tests written in plain language". There is no magic there: it just maps strings (known as steps) onto blocks of code (step definitions) and executes them in order. Cucumber is also enforcing a particular language style - called [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) - that helps to stay focused on features and examples (aka scenarios).

Cucumber is seen by many as a controversial tool. Loose grammar leads to disagreement on feature style, mapping strings to code via regular expressions makes it hard to navigate from feature files to steps definitions. Still. It is the only thing that can turn our understanding of the system into executable script and that is more important. Not only that, writing step definitions is naturally the next step of peeling the feature onion. Since we go one level deeper from "what users are trying to achieve?" down to "how do they use our system to achieve it?". Writing step definitions is going to force us to look into the system's outer interfaces - UI on one end, database on the other - without too much focus on how those interfaces fit together internally.

Anyway. Our thoughtwork looks right at home in a cucumber feature file:

```cucumber
Feature: Completing a Task
  As a victim,
  I need a very simple way to communicate the completion of a task.
  So that, as stressed as I am, I am less likely to mess it up.

  Scenario: Victim completes a task
    Given Alice is tasked to deliver a cake to an address
    When she delivers it
    Then she can cross this task off the list
    And Bob the Villain gets notified

  Scenario: Victim "uncompletes" a task completed by accident
    Given Alice is tasked to deliver a cake to an address
    When she accidentally marks it complete
    Then she can undo it and Bob the Villain gets notified both times
```

Writing step definitions for the first scenario forces us to think of the UI (because step definition code is little more than automating web page navigation and DOM assertions). After discussing with the client, we settle on a checkbox and a confirmation message once its checked.
This, along with the feature file, makes our first [commit](../../commit/9d38e2aeba0819cbe4b9328ff4e039c9fcd99cac). If you check it out and run

```
yarn install
yarn test -- features/complete_task.feature
```

You should see a failure that basically says `Can't find a checkbox to tick`. Which is expected, as there is no checkbox yet.

A word on the tools used in this project. They may not look familiar, but that is OK. I am deliberately focusing on the flow for now, leaving the tools that support it for later.

Finally it's time to write some production code. Even though `And Bob the Villain gets notified` step is left pending for now, there is enough of a meaningful failure to get down to the implementation. Bear in mind that at this point we don't write any other tests. Our first implementation is an exploratory attempt, guided by cucumber feature in terms of _what_ it should do, but not restricted by any lower level tests in terms of _how_ it should do it. It is also a sketch. In a sense that we're allowed to ignore edge cases, error handling and anything else not directly related to turning that one scenario green. All this means that when we emerge on the other end it'll be easier to assess the solution just by looking at (as lots of details aren't coded yet) it and it'll be easier to change it if it doesn't feel right (since there aren't any tests).
