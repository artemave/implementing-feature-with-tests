const express = require('express')
const browserify = require('browserify-middleware')
const createDb = require('./db')

module.exports = function (
  {db = createDb(process.env.DB_PATH || 'app.db')} = {}
) {
  const app = express()

  app.get('/taskList/:id/tasks', function (req, res) {
    db.tasks(req.params.id).then(tasks => {
      res.send(tasks)
    })
  })

  app.post('/tasks/:id/complete', function (req, res) {
    db
      .task(req.params.id)
      .then(task => {
        task.isComplete = true
        return task.save()
      })
      .then(() => {
        res.end()
      })
      .catch(e => {
        console.log(e)
        res.status(500).end()
      })
  })

  app.get(
    '/bundle.js',
    browserify('browser/index.js', {
      transform: ['babelify']
    })
  )

  app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })

  return app
}

if (!module.parent) {
  const port = process.env.PORT || 4987
  module.exports().listen(port)
  console.log(`App started on http://localhost:${port}`)
}
