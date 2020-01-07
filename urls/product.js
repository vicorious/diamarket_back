'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const ProductController = require('../controllers/productController')
const AvailabilityController = require('../controllers/availabilityController')
const token = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const routesProductApp = asyncify(express.Router())
const routesProductWeb = asyncify(express.Router())

routesProductWeb.post('', convertBase64ToFile, token, async (request, response) => {
  const data = request.body
  const create = await ProductController.create(data)
  response.json(create)
})

routesProductWeb.put('/:id', convertBase64ToFile, token, async (request, response) => {
  const id = request.params.id
  const data = request.body
  const update = await ProductController.update(id, data)
  response.json(update)
})

routesProductWeb.get('/forsupermarket/:id', token, async (request, response) => {
  const products = await AvailabilityController.productsSuperMarkets()
  response.json(products)
})

routesProductWeb.post('/forcategory', token, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForCategory(data)
  response.json(products)
})

routesProductWeb.get('/:id', token, async (request, response) => {
  const id = request.param.id
  const detail = await ProductController.detail(id)
  response.json(detail)
})

routesProductWeb.post('/forname', token, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForName(data)
  response.json(products)
})

routesProductWeb.get('/categoryData', async (request, response) => {
  const create = await ProductController.categoryData()
  response.json(create)
})

routesProductWeb.get('/forsupermarket/:id', token, async (request, response) => {
  const id = request.params.id
  const products = await AvailabilityController.productsSuperMarkets(id)
  response.json(products)
})

routesProductApp.post('/forcategory', token, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForCategory(data)
  response.json(products)
})

routesProductApp.get('/:id', token, async (request, response) => {
  const id = request.params.id
  const detail = await ProductController.detail(id)
  response.json(detail)
})

routesProductApp.post('/forname', token, async (request, response) => {
  const data = request.body
  const products = await AvailabilityController.productsForName(data)
  response.json(products)
})

routesProductApp.get('/categoryData', async (request, response) => {
  const create = await ProductController.categoryData()
  response.json(create)
})

module.exports = { routesProductApp, routesProductWeb }
