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

routes.put('/deleteImage/:id', async(request, response) => {
    const id = request.params.id
    const deleteImage = await supermarketController.deleteImage(id, request.body)
    response.json(deleteImage)
})

routes.put('/updateimage/:id', async(request, response) => {
    const id = request.params.id
    const update = await supermarketController.updateImage(id, request.body)
    response.json(update)
})

routes.get('/all', async(request, response) => {
    const getAll = await supermarketController.detailAll()
    response.json(getAll)
})

routes.get('/detail/:id', async(request, response) => {
    const getfirst = await supermarketController.detail(request.params.id)
    response.json(getfirst)
})

routes.put('/rate/:id', async(request, response) => {
    const rate = await supermarketController.rateSupermarket(request.params.id, request.body)
    response.json(rate)
})

module.exports = routes