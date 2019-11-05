'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const ProductController = require('../controllers/productController')

routes.post('/create', async(request, response) => {
    const create = await ProductController.create(request.body)
    response.json(create)
})

module.exports = routes