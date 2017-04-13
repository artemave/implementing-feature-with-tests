Feature: View Tasks
  As a victim,
  I need to see what tasks I am required to do.
  So that I can complete them all and hopefully get off the hook.

  Scenario: Victim views her tasks
    Given Alice is a victim
    When she receives a link to her task list
    Then she should be able to view them
