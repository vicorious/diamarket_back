'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    const create = await supermarketController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', token, async(request, response) => {
    const id = request.params.id
    const update = await supermarketController.update(id, request.body)
    response.json(update)
})

routes.put('/deleteImage/:id', token, async(request, response) => {
    const id = request.params.id
    const deleteImage = await supermarketController.deleteImage(id, request.body)
    response.json(deleteImage)
})

routes.put('/updateimage/:id', token, async(request, response) => {
    const id = request.params.id
    const update = await supermarketController.updateImage(id, request.body)
    response.json(update)
})

routes.get('/all', token, async(request, response) => {
    const getAll = await supermarketController.detailAll({})
    response.json(getAll)
})

routes.get('/detail/:id', token, async(request, response) => {
    const getfirst = await supermarketController.detail(request.params.id)
    response.json(getfirst)
})

routes.get('/detailimage/:id', token, async(request, response) => {
    const getfirst = await supermarketController.detailImage(request.params.id)
    response.json(getfirst)
})

routes.put('/rate/:id', token, async(request, response) => {
    const rate = await supermarketController.rateSupermarket(request.params.id, request.body)
    response.json(rate)
})

module.exports = routes