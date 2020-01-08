'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routeSwaggerWeb = asyncify(express.Router())
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const options = require('../config/swagger')
const swaggerSpec = swaggerJSDoc(options)
routeSwaggerWeb.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

module.exports = { routeSwaggerWeb }
