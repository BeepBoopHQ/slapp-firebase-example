'use strict'

const firebase = require('firebase-admin')

module.exports = () => {
  const firebaseDBUrl = process.env.FIREBASE_DB_URL
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64

  firebase.initializeApp({
    credential: firebase.credential.cert(b64ToObject(serviceAccountBase64)),
    databaseURL: firebaseDBUrl
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

function b64ToObject (b64) {
  return !b64 ? {} : JSON.parse(Buffer.from(b64, 'base64').toString('ascii'))
}
