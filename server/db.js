const sworm = require('sworm')

class Db {
  constructor (dbPath) {
    this.db = sworm.db({
      driver: 'sqlite',
      config: {
        filename: dbPath,
      },
    })

    this.taskList = this.db.model({table: 'task_lists'})
    this.task = this.db.model({table: 'tasks'})
  }

  createSchema () {
    return Promise.all([
      this.db.query(
        'create table tasks (id integer, task_list_id integer, text text)'
      ),
      this.db.query('create table task_lists (id integer)'),
    ])
  }

  dropSchema () {
    return Promise.all([
      this.db.query('drop table if exists tasks'),
      this.db.query('drop table if exists task_lists'),
    ])
  }

  tasks (taskListId) {
    return this.task.query('select * from tasks where task_list_id = @id', {
      id: taskListId,
    })
  }
}

module.exports = function (dbPath) {
  return new Db(dbPath)
}
