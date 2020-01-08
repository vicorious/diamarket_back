'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesPromotionWeb = asyncify(express.Router())
const routesPromotionApp = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesPromotionWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const create = await PromotionController.create(request.body)
  response.json(create)
})
routesPromotionWeb.put('/:id', isSuperAdmin, convertBase64ToFile, async (request, response) => {
  const update = await PromotionController.update(request.params.id, request.body)
  response.json(update)
})
routesPromotionWeb.get('/all/:supermarket', isSuperAdmin, isAdmin, async (request, response) => {
  const supermarket = request.params.supermarket
  const search = await PromotionController.all(supermarket)
  response.json(search)
})
routesPromotionWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const detail = await PromotionController.detail(request.params.id)
  response.json(detail)
})

routesPromotionApp.get('/all/:supermarket', isClient, async (request, response) => {
  const supermarket = request.params.supermarket
  const search = await PromotionController.all(supermarket)
  response.json(search)
})

module.exports = { routesPromotionApp, routesPromotionWeb }
