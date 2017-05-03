const {defineSupportCode} = require('cucumber')
const {navigateTo} = require('../support/pageHelpers')

defineSupportCode(function ({Given, When, Then}) {
  Given('Alice is a victim', async function () {
    const taskList = this.db.schema.taskList({
      tasks: task_list => {
        return [
          this.db.schema.task({
            task_list,
            text: 'Deliver a cake'
          }),
          this.db.schema.task({
            task_list,
            text: 'Rob a bank'
          })
        ]
      }
    })

    await taskList.save()
    this.taskListId = taskList.identity()
  })

  When('she receives a link to her task list', function () {
    this.page = navigateTo(`http://localhost:${this.port}/${this.taskListId}`)
  })

  Then('she should be able to view them', function () {
    return this.page
      .find('ul li')
      .shouldHave({text: ['Deliver a cake', 'Rob a bank']})
  })
})
