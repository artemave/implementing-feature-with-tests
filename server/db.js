const sworm = require('sworm')

class Db {
  constructor (dbPath) {
    this.db = sworm.db({
      driver: 'sqlite',
      config: {
        filename: dbPath
      }
    })

    this.schema = {
      taskList: this.db.model({table: 'task_lists'}),
      task: this.db.model({table: 'tasks'})
    }
  }

  createSchema () {
    return Promise.all([
      this.db.query(
        'create table tasks (id integer not null primary key, task_list_id integer, text text, isComplete text)'
      ),
      this.db.query('create table task_lists (id integer not null primary key)')
    ])
  }

  dropSchema () {
    return Promise.all([
      this.db.query('drop table if exists tasks'),
      this.db.query('drop table if exists task_lists')
    ])
  }

  tasks (taskListId) {
    return this.schema.task.query(
      'select * from tasks where task_list_id = @id',
      {
        id: taskListId
      }
    )
  }

  async task (taskId) {
    const task = (await this.schema.task.query(
      'select * from tasks where id = @id',
      {
        id: taskId
      }
    ))[0]
    return task
  }
}

module.exports = function (dbPath) {
  return new Db(dbPath)
}
