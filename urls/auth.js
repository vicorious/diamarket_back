'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const Auth = require('../controllers/authController')

const routesAuthWeb = asyncify(express.Router())
const routesAuthApp = asyncify(express.Router())

routesAuthWeb.post('', async (request, response) => {
  const data = request.body
  const token = await Auth.createToken(data)
  response.json(token)
})

routesAuthApp.post('', async (request, response) => {
  const data = request.body
  const token = await Auth.createToken(data)
  response.json(token)
})

routesAuthApp.post('/social', async (request, response) => {
  const data = request.body
  const token = await Auth.createTokenSocial(data)
  response.json(token)
})
module.exports = { routesAuthApp, routesAuthWeb }
