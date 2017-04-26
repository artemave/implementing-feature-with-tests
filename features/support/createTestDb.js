const createDb = require('../../server/db')

module.exports = async function (dbPath = __dirname + '/test.db') {
  const db = createDb(dbPath)
  await db.dropSchema()
  await db.createSchema()
  return db
}

if (!module.parent) {
  module.exports(process.cwd() + '/app.db').then(db => {
    const taskList = db.schema.taskList({
      tasks: task_list => {
        return [
          db.schema.task({
            task_list,
            text: 'Deliver a cake',
          }),
          db.schema.task({
            task_list,
            isComplete: true,
            text: 'Rob a bank',
          }),
        ]
      },
    })

    taskList.save()
  })
}
