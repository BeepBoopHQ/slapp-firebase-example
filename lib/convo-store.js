'use strict'

// Slim wrapper around data module for Slapp ConvoStore
module.exports = (db) => {
  return {
    set (id, params, done) {
      db.saveConvo(id, params, done)
    },
    get (id, done) {
      db.getConvo(id, done)
    },
    del (id, done) {
      db.deleteConvo(id, done)
    }
  }
}
