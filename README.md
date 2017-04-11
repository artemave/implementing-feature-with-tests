# implementing-feature-with-tests

## Why bother with tests?

The value of production code is unquestionable. It brings to live features that make up the product. The value of test code on the other hand is less obvious. At any given moment all of it can be thrown away and users won't notice. So why bother?

Let’s see what happens after all tests are removed. The next code change accidentally breaks any of the existing functionality - we won't notice. The only people who are going to notice will be the users when the change is shipped into production. This is a very long and sometimes prohibitively expensive feedback cycle. In contrast, running automated tests only takes few minutes and costs few dollars of CI subscription.

To put it another way, if production code represents features, test code represents the ability to add more features. On projects that keep changing over time (e.g. web applications) both are essential.

The value of tests doesn’t actually stop there. If developed using TDD, they also _drive_ the internal system architecture. Because the interfaces between components have to be designed and thought through before they’re implemented. This is also known as 'outside in’. Where ‘outside' is the interface and ‘in’ is the implementation.

TDD is a hard sell though. The idea is slightly more abstract than simply ‘keep existing code from breaking’. It requires more effort to adapt - writing tests _first_ may feel very alien to begin with - more discipline to keep it going and also there are plenty of folks out there who aren’t convinced about the whole thing anyway. So I am going to leave it there and keep this post focused on more immediately practical testing rather than turning it into yet another attempt to sell TDD (of which there are many good ones already).

## Ok. But how?

We've established that tests are essential. Now how do we go about writing them? This is a popular question, but it's also a bit misleading. Tests aren't there for the sake of it, nor they're written by someone else, so the question should really be put more broadly: how do we build software with tests?

In an ideal scenario, each feature is implemented and delivered separately. Code that implements it is a combination of production and test code. So the above question can be simplified into 'how do we build a feature with tests?’ And that is better illustrated with an example.

## Let’s look at some code.

We've just joined a team that works on a task list application. Out client is the villain from [Black Mirror S3E3](http://www.imdb.com/title/tt5709230/). Following their initial success, they figured that messaging app is not the best way to setup and follow the progress of victims’ tasks. Instead, they’re planning to be sending a victim a unique link to the their personal task list.

At this point, the app is already showing tasks. Our first assignment is to add the ability to mark them complete.

Where do we start? The very first thing to do is to make sure we understand what needs to be done, who needs this and why. I am going to explain the benefits of this later, but certainly better understanding can’t hurt, can it? And even if it is a waste of time, it is a small one, since all we do is just writing few words.

A good way to understand something is to write it down. This way it can also be shared with others and preserved in source history. So let's write it down:

_"As a victim, I need a very simple way to communicate the completion of a task. So that, as stressed as I am, I am less likely to mess it up."_

Since we’re on it, let’s also write an example of how someone would use this feature:

_"Given Alice is tasked to deliver a cake to an address, when she delivers it, then she can cross this task off the list and Bob the Villain gets notified"_

Interestingly, this little exercise revealed a detail that was missing in the original description: villain needs to be notified. Also, the "mess it up" bit will still be happening. So, clearly, there is some extra work needed to make sure they can undo the task completion. This can be captured in another example:

_"Given Alice is tasked to deliver a cake to an address, when she accidentally marks it complete, then she can undo it and Bob the Villain gets notified both times"_

Just like that, at the cost of only few sentences (and no code at all) we’ve uncovered important changes. In a way, this is the first deliverable. We can now go back to the customer with more questions, updated estimates and more detailed list of what is going to change. And give them a chance to reevaluate before any work has started.

And this is why understanding the feature and documenting it is such a perfect start. Loading up the high level context in your brain often brings up important questions that are easy to overlook if you laser focus on say db schema changes to begin with. And when you eventually catch up with the reality, there is already some code written that may not be quite as fit for purpose. At which point it is too tempting to bend it into kinda doing the right thing rather than throwing it away and do just the right thing.

As useful as our little script is, there is no guarantee that at any point now or in the future our system is (still) doing what it is supposed to. If only we could somehow actually execute the script to verify the behavior.

Meet [Cucumber](https://github.com/cucumber/cucumber-js) - "a tool for running automated tests written in plain language". There is no magic there: it just maps strings (known as steps) onto blocks of code (step definitions) and executes them in order. Cucumber is also enforcing a particular language style - called [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) - that helps to stay focused on features and examples (aka scenarios).

Cucumber is seen by many as a controversial tool. I am myself not a huge fan of the mapping bit because it is a major pain to navigate between steps and definitions. Still. Its value is greater than its flaws. It allows us to make our understanding of the system executable. Not only that, writing step definitions is naturally the next step of peeling the feature onion. Since we go one level deeper from "what users are trying to achieve" down to "how they use our system to achieve it". Writing step definitions is going to force us to look into system's outer interfaces - UI/email on one end, database on the other - without too much focus on how those interfaces fit together internally.

Here goes our feature file:

```
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
