'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const SupermarketController = require('../controllers/supermarketController')
const UserController = require('../controllers/userController')

routes.post('/detailgeneral', async(request, response) => {
    const product = await ProductController.detailAll({name:request.body.name})
    const user = await UserController.detailAll({name:request.body.name})
    response.json(search)
})

module.exports = routes