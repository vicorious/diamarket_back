'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const ProductController = require('../controllers/productController')
const AvailabilityController = require('../controllers/availabilityController')
const token = require('../middleware/token')
const {convertBase64ToFile} = require('../middleware/convertBase64File')

routes.post('/create', convertBase64ToFile, token, async(request, response) => {
    const create = await ProductController.create(request.body)
    response.json(create)
})

routes.get('/forsupermarket/:id', token, async( request, response ) => {
    const id = request.params.id
    const products = await AvailabilityController.productsSuperMarkets(id)
    response.json(products)
})

routes.post('/forcategory', token, async (request, response) => {
    const data = request.body
    const products = await AvailabilityController.productsForCategory(data)
    response.json(products)
})

routes.post('/forname', token, async (request, response) => {
    const data = request.body
    const products = await AvailabilityController.productsForName(data)
    response.json(products)
})


module.exports = routes