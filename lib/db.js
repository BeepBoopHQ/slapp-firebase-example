'use strict'

const path = require('path')
const firebase = require('firebase')

module.exports = () => {
  firebase.initializeApp({
    serviceAccount: path.join(__dirname, '..', 'firebase.json'),
    databaseURL: process.env.FIREBASE_DB_URL
  })

  let database = firebase.database()

  return {
    saveTeam (id, data, done) {
      database.ref(`teams/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getTeam (id, done) {
      database.ref(`teams/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    saveConvo (id, data, done) {
      database.ref(`convos/${id}`).set(data, (err) => {
        if (err) {
          return done(err)
        }

        return done(null)
      })
    },

    getConvo (id, done) {
      database.ref(`convos/${id}`).once('value', (snapshot) => {
        done(null, snapshot.val())
      }, done)
    },

    deleteConvo (id, done) {
      database.ref(`convos/${id}`).remove(done)
    }
  }
}
