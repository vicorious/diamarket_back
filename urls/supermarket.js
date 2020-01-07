'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesSupermarketWeb = asyncify(express.Router())
const routesSupermarketApp = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')
const { isSuperAdmin, isClient } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesSupermarketWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await supermarketController.create(data)
  response.json(create)
})

routesSupermarketWeb.put('/:id', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await supermarketController.update({ _id }, data)
  response.json(update)
})

routesSupermarketWeb.get('', isSuperAdmin, async (request, response) => {
  const all = await supermarketController.all()
  response.json(all)
})

routesSupermarketWeb.get('/:id', isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await supermarketController.detail({ _id })
  response.json(detail)
})

routesSupermarketApp.put('/rate/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const rate = await supermarketController.rateSupermarket({ _id }, data)
  response.json(rate)
})

module.exports = { routesSupermarketApp, routesSupermarketWeb }
