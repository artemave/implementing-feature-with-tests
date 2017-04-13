const fs = require('fs')
const createDb = require('../../server/db')

module.exports = async function () {
  const dbPath = __dirname + '/test.db'
  fs.existsSync(dbPath) && fs.unlinkSync(dbPath)
  const db = createDb(dbPath)
  await db.createSchema()
  return db
}
