'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')

routes.post('/create', async(request, response) => {
    const create = await PromotionController.create(request.body)
    response.json(create)
})
routes.get('/all/:supermarket', async(request, response) => {
    const supermarket = request.params.supermarket
    const search = await PromotionController.detailAll({supermarket})
    response.json(search)
})

module.exports = routes