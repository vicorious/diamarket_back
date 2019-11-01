'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')

routes.use('/create', async(request, response) => {
    const create = await supermarketController.create(request.body)
    response.json(create)
})

module.exports = routes