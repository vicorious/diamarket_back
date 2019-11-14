'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const ProductController = require('../controllers/productController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    const create = await ProductController.create(request.body)
    response.json(create)
})

routes.get('/category/:category', token, async(request, response) => {
    const search = await ProductController.detailAll({ category: request.params.category })
    response.json(search)
})

routes.post('/name', token, async(request, response) => {
    const search = await ProductController.detailAll({ name: request.body.name })
    response.json(search)
})

module.exports = routes