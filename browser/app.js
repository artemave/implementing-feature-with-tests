const hyperdom = require('hyperdom')
const router = require('hyperdom-router')
const httpism = require('httpism')
const h = hyperdom.html

class App {
  constructor () {
    this.routes = {
      taskList: router.route('/:taskListId'),
    }
    router.start()
  }

  renderTasks () {
    if (this.tasks) {
      return h(
        'ul',
        this.tasks.map(task => {
          return h('li', task.text)
        })
      )
    } else {
      return h('div', 'Loading...')
    }
  }

  async loadTasks (taskListId) {
    this.tasks = (await httpism.get(`/taskList/${taskListId}/tasks`)).body
  }

  render () {
    return h(
      'div',
      this.routes.taskList(
        {onarrival: params => this.loadTasks(params.taskListId)},
        () => this.renderTasks()
      )
    )
  }
}

module.exports = App
