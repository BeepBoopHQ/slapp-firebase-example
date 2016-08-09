'use strict'

const Slapp = require('./slapp')
const DB = require('./db')
const OAuth = require('./oauth')

module.exports = (server) => {
  let db = DB()
  let app = Slapp(server, db)
  OAuth(server, db)
}
