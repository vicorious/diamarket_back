'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const ProductController = require('../controllers/productController')

routes.post('/create', async(request, response) => {
    const create = await ProductController.create(request.body)
    response.json(create)
})
routes.get('/category/:category', async(request, response) => {
    const search = await ProductController.detailAll({category:request.params.category})
    response.json(search)
})
routes.post('/name', async(request, response) => {
    const search = await ProductController.detailAll({name:request.body.name})
    response.json(search)
})

module.exports = routes