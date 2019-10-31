'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const Auth = require('../controllers/authController')

const routes = asyncify(express.Router())

routes.post('/token', async (request, response) => {
  const token = await Auth.createToken(request.body)
  response.json(token)
})

routes.post('/tokenbackoffice', async (request, response) => {
  const token = await Auth.createTokenBackoffice(request.body)
  response.json(token)
})
module.exports = routes
