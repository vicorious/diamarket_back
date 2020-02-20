'use strict'
const chalk = require('chalk')
const mongoose = require('mongoose')
const { DATABASES } = require('./settings')

mongoose.connect(`mongodb://${DATABASES.default.HOST}/${DATABASES.default.NAME}`, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => {
  console.error(`${chalk.red('MongoDB connection error:')}`, error.message)
  process.exit(0)
})

module.exports = db
