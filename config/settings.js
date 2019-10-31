'use strict'

const DATABASES = {
  default: {
    NAME: process.env.NODE_ENV || 'diamarket',
    HOST: process.env.HOST || 'localhost'
  }
}

module.exports = { DATABASES }
