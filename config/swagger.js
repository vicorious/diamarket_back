'use strict'
const swaggerDefinition = {
  info: {
    title: 'Diamarket Swagger Api',
    version: '0.0.0.1',
    description: 'En este documento se describirà cada endpoint desarrollado'
  },
  host: 'api.diamarket.co',
  basePath: '/v1',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header'
    }
  }
}

const options = {
  swaggerDefinition,
  apis: ['./urls/*js', './models/*js']
}

module.exports = options
