'use strict'

const App = require('./lib/')
const express = require('express')
const PORT = process.env.PORT || 3000

let server = express()

App(server)

server.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log('http server started on port %s', PORT)
})
