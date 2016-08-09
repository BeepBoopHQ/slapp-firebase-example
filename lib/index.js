'use strict'

const Slapp = require('./slapp')
const DB = require('./db')
const OAuth = require('./oauth')

module.exports = (server) => {
  let db = DB()

  OAuth(server, db)
  Slapp(server, db)

  return server
}
