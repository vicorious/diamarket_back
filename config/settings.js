'use strict'

const DATABASES = {
  mongodb: {
    NAME: process.env.NODE_ENV || 'diamarket',
    // HOST: process.env.HOST || 'admin_diamarket:5q9prVAPlySbU7m@localhost'
    // HOST: process.env.HOST || 'admin_diamarket:5q9prVAPlySbU7m@3.18.129.126'
    HOST: process.env.HOST || 'localhost'
  },
  sqlServer: {
    user: 'zuluagasoto',
    password: 'Zuluagasoto$12$%',
    server: '169.55.75.48',
    port: 20446,
    database: 'UnoEE'
  }
}
// SQL_DB_HOST=169.55.75.48
// SQL_DB_PORT=20446
// SQL_DB_DATABASE=UnoEE
// SQL_DB_USERNAME=zuluagasoto
// SQL_DB_PASSWORD=Zuluagasoto$12$%

module.exports = { DATABASES }
