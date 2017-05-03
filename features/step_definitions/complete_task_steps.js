const {defineSupportCode} = require('cucumber')
const {navigateTo, reloadPage} = require('../support/pageHelpers')

defineSupportCode(function ({Given, When, Then}) {
  Given('Alice is tasked to deliver a cake to an address', async function () {
    const taskList = this.db.schema.taskList({
      tasks: task_list => {
        return [
          this.db.schema.task({
            task_list,
            text: 'Deliver a cake'
          })
        ]
      }
    })

    await taskList.save()
    this.taskListId = taskList.identity()
  })

  When('she delivers it', function () {})

  Then('she can cross this task off the list', async function () {
    this.page = navigateTo(`http://localhost:${this.port}/${this.taskListId}`)

    const taskToggle = this.page
      .find('li', {text: 'Deliver a cake'})
      .find('input[type="checkbox"]')

    await taskToggle.click()
    await this.page.shouldHave({text: 'Done!'})

    await reloadPage(this.page)
    await taskToggle.shouldHave({checked: true})
  })

  Then('Bob the Villain gets notified', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })
})
