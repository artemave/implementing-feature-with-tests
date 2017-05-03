const {defineSupportCode} = require('cucumber')
const createServerApp = require('../../server/app')
const createTestDb = require('../support/createTestDb')

defineSupportCode(function ({Before, After}) {
  Before(async function () {
    this.db = await createTestDb()

    this.port = 8753
    this.server = createServerApp({
      db: this.db
    }).listen(this.port)
  })

  After(function () {
    this.server.close()
  })
})
