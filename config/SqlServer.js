'use strict'
const sqlServer = require('mssql')
const { DATABASES } = require('./settings')
sqlServer.connect(DATABASES.sqlServer, function (error, response) {
  if (error) {
    console.log('error', error)
  } else {
    console.log('Conectado correctamente')
  }
})
