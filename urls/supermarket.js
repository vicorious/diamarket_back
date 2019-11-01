'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')

routes.post('/create', async(request, response) => {
    const create = await supermarketController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', async(request, response) => {
    const id = request.params.id
    const update = await supermarketController.update(id, request.body)
    response.json(update)
})

module.exports = routes