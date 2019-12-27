'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const ProductController = require('../controllers/productController')
const AvailabilityController = require('../controllers/availabilityController')
const token = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routes.post('/create', convertBase64ToFile, token, async(request, response) => {
    const create = await ProductController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', convertBase64ToFile, token, async(request, response) => {
    const update = await ProductController.update(request.params.id, request.body)
    response.json(update)
})

routes.get('/forsupermarket/:id', token, async(request, response) => {
    const id = request.params.id
    const products = await AvailabilityController.productsSuperMarkets(id)
    response.json(products)
})

routes.post('/forcategory', token, async(request, response) => {
    const data = request.body
    const products = await AvailabilityController.productsForCategory(data)
    response.json(products)
})

routes.get('/detail/:id', token, async(request, response) => {
    const detail = await ProductController.detail(request.params.id)
    response.json(detail)
})

routes.post('/forname', token, async(request, response) => {
    const data = request.body
    const products = await AvailabilityController.productsForName(data)
    response.json(products)
})

routes.get('/categoryData', async(request, response)=>{
    const create = await ProductController.categoryData()
    response.json(create)
})

module.exports = routes