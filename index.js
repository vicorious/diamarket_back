'use strict'
require('./config/MongoDb')
require('./config/SqlServer')
require('./config/firebase')
const express = require('express')
const asyncify = require('express-asyncify')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const routeUser = require('./urls/routes')
const cookieParser = require('cookie-parser')

const port = 5002
const app = asyncify(express())
const server = http.createServer(app)
const io = require('socket.io')(server)

let clientId
io.on('connect', (socket) => {
  clientId = socket.id
  socket.on('payPse', function (data) {
    io.emit('payPse', data)
  })
  socket.on('changeStatus', function(data){
    io.emit('changeStatus', data)
  })
})
app.use((request, response, next) => {
  request.io = { io, clientId}
  next()
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json({ extended: true, limit: '20000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '20000mb' }))
app.use(cookieParser())
app.use('/v1', routeUser)

server.listen(port, () => {
  console.log(`${chalk.green('[diamarket-account]')} server listening on port ${port}`)
})

module.exports = server
 