'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')
const token = require('../middleware/token')
const {convertBase64ToFile} = require('../middleware/convertBase64File')

routes.post('/create', convertBase64ToFile, token, async(request, response) => {
    const create = await supermarketController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', convertBase64ToFile, token ,async(request, response) => {
    const id = request.params.id
    const update = await supermarketController.update(id, request.body)
    response.json(update)
})

routes.put('/deleteImage/:id', token, async(request, response) => {
    const id = request.params.id
    const deleteImage = await supermarketController.deleteImage(id, request.body)
    response.json(deleteImage)
})

routes.put('/updateimage/:id',convertBase64ToFile, async(request, response) => {
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

routes.put('/rate/:id', token, async(request, response) => {
    const rate = await supermarketController.rateSupermarket(request.params.id, request.body)
    response.json(rate)
})

module.exports = routes