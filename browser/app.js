const hyperdom = require('hyperdom')
const router = require('hyperdom/router')
const api = require('httpism')
const h = hyperdom.html

const routes = {
  taskList: router.route('/:taskListId')
}

module.exports = class App {
  async completeTask (task) {
    await api.post(`/tasks/${task.id}/complete`)
    this.showFlash('Done!')
  }

  showFlash (msg) {
    this.flash = msg
    setTimeout(
      () => {
        this.flash = ''
        this.refresh()
      },
      2000
    )
  }

  renderTasks () {
    return h(
      'ul',
      this.tasks.map(task => {
        return h(
          'li',
          task.text,
          h('input', {
            type: 'checkbox',
            binding: [task, 'isComplete'],
            onchange: () => this.completeTask(task)
          })
        )
      })
    )
  }

  async loadTasks (taskListId) {
    this.tasks = await api.get(`/taskList/${taskListId}/tasks`)
  }

  routes () {
    return [
      routes.taskList({
        onload: params => this.loadTasks(params.taskListId),
        render: () => this.tasks ? this.renderTasks() : h('div', 'Loading...')
      })
    ]
  }

  render (content) {
    return h('main', content, h('div.flash', this.flash))
  }
}
