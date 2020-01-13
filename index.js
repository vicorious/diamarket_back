'use strict'
require('./config/db')
const express = require('express')
const asyncify = require('express-asyncify')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const routeUser = require('./urls/routes')
const port = 5002
const app = asyncify(express())
const server = http.createServer(app)
const passport = require('passport')

app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json({ extended: true, limit: '20000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '20000mb' }))
app.use('/v1', routeUser)

server.listen(port, () => {
  console.log(`${chalk.green('[diamarket-account]')} server listening on port ${port}`)
})

module.exports = server
