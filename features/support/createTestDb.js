const createDb = require('../../server/db')

module.exports = async function () {
  const dbPath = __dirname + '/test.db'
  const db = createDb(dbPath)
  await db.dropSchema()
  await db.createSchema()
  return db
}
