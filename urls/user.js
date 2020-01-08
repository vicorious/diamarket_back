'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const { isSuperAdmin, isAdmin, isDomiciliary, isClient } = require('../middleware/token')
const routesUserApp = asyncify(express.Router())
const routesUserWeb = asyncify(express.Router())
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesUserWeb.post('', isSuperAdmin, isAdmin, async (request, response) => {
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

routesUserWeb.put('', convertBase64ToFile, isSuperAdmin, isAdmin, isDomiciliary, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const update = await UserController.update({ _id }, data)
  response.json(update)
})

routesUserWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = await UserController.detail({ _id })
  response.json(data)
})

routesUserWeb.get('/detail', isSuperAdmin, isAdmin, isDomiciliary, async (request, response) => {
  const _id = request.User.id
  const detail = await UserController.detail({ _id })
  response.json(detail)
})

routesUserWeb.get('/clients', isSuperAdmin, async (request, response) => {
  const data = await UserController.all({ rol: 'client' })
  response.json(data)
})

routesUserWeb.get('/all/domiciliary', isSuperAdmin, async (request, response) => {
  const data = await UserController.all({ rol: 'domiciliary' })
  response.json(data)
})

routesUserWeb.get('/supermarketclients/:id', isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = await UserController.clientSupermarket(_id)
  response.json(data)
})

routesUserApp.post('', async (request, response) => {
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

routesUserApp.post('/direction', isClient, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const createDirection = await UserController.createDirection({ _id }, data)
  response.json(createDirection)
})

routesUserApp.put('', convertBase64ToFile, isClient, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const update = await UserController.update({ _id }, data)
  response.json(update)
})

routesUserApp.put('/validate', async (request, response) => {
  const data = request.body
  const validate = await UserController.validate(data)
  response.json(validate)
})

routesUserApp.post('/verifycode', async (request, response) => {
  const data = request.body.email
  const update = await UserController.sendEmailPassword(data)
  response.json(update)
})

routesUserApp.post('/resetpassword', async (request, response) => {
  const data = request.body
  const user = await UserController.updatePassword(data)
  response.json(user)
})

routesUserApp.get('/detail', isClient, async (request, response) => {
  const _id = request.User.id
  const user = await UserController.detail({ _id })
  response.json(user)
})

module.exports = { routesUserApp, routesUserWeb }
