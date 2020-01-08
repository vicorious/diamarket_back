'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const PqrController = require('../controllers/pqrController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const routesPqrWeb = asyncify(express.Router())
const routesPqrApp = asyncify(express.Router())

routesPqrWeb.post('', isAdmin, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await PqrController.create(data)
  response.json(create)
})

routesPqrWeb.get('', isSuperAdmin, async (request, response) => {
  const all = await PqrController.getAll()
  response.json(all)
})

routesPqrWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await PqrController.getFirst({ _id })
  response.json(detail)
})

routesPqrWeb.put('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await PqrController.update({ _id }, data)
  response.json(update)
})

routesPqrWeb.get('/bysupermarket', isAdmin, async (request, response) => {
  const _id = request.user.id
  const pqrs = await PqrController.bySupermarket({ _id })
  response.json(pqrs)
})

routesPqrApp.post('', isClient, async (request, response) => {
  request.body.client = request.user.id
  const data = request.body
  const create = await PqrController.create(data)
  response.json(create)
})

routesPqrApp.get('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await PqrController.getFirst({ _id })
  response.json(detail)
})

routesPqrApp.get('/byuser', isClient, async (request, response) => {
  const id = request.user.id
  const all = await PqrController.allForUser(id)
  response.json(all)
})

module.exports = { routesPqrApp, routesPqrWeb }
