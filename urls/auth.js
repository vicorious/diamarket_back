'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const Auth = require('../controllers/authController')

const routesAuthWeb = asyncify(express.Router())
const routesAuthApp = asyncify(express.Router())

routesAuthApp.post('', async (request, response) => {
  const token = await Auth.createToken(request.body)
  response.json(token)
})

routesAuthWeb.post('', async (request, response) => {
  const token = await Auth.createTokenBackoffice(request.body)
  response.json(token)
})
module.exports = { routesAuthApp, routesAuthWeb }
