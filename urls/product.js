'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const ProductController = require('../controllers/productController')
const AvailabilityController = require('../controllers/availabilityController')
const { isAdmin, isClient, isSuperAdmin, isDomiciliary } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const routesProductApp = asyncify(express.Router())
const routesProductWeb = asyncify(express.Router())

routesProductWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await ProductController.create(data)
  response.json(create)
})

routesProductWeb.put('/:id', convertBase64ToFile, isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await ProductController.update({ _id }, data)
  response.json(update)
})

routesProductWeb.get('/forsupermarket/:id', isAdmin, async (request, response) => {
  const products = await AvailabilityController.productsSuperMarkets()
  response.json(products)
})

routesProductWeb.post('/forcategory', isAdmin, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForCategory(data)
  response.json(products)
})

routesProductWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.param.id
  const detail = await ProductController.detail({ _id })
  response.json(detail)
})

routesProductWeb.post('/forname', isSuperAdmin, isAdmin, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForName(data)
  response.json(products)
})

routesProductApp.get('/forsupermarket/:id', isClient, isDomiciliary, async (request, response) => {
  const idSupermarket = request.params.id
  const products = await AvailabilityController.productsSuperMarkets({ idSupermarket })
  response.json(products)
})

routesProductApp.post('/forcategory', isClient, isDomiciliary, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForCategory(data)
  response.json(products)
})

routesProductApp.get('/:id', isClient, isDomiciliary, async (request, response) => {
  const _id = request.params.id
  const detail = await ProductController.detail({ _id })
  response.json(detail)
})

routesProductApp.post('/forname', isClient, isDomiciliary, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForName(data)
  response.json(products)
})

module.exports = { routesProductApp, routesProductWeb }
