Feature: Completing a Task
  As a victim,
  I need a very simple way to communicate the completion of a task.
  So that, as stressed as I am, I am less likely to mess it up.

  Scenario: Victim completes a task
    Given Alice is tasked to deliver a cake to an address
    When she delivers it
    Then she can cross this task off the list
    And Bob the Villain gets notified
