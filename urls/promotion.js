'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')
const token = require('../middleware/token')
const {convertBase64ToFile} = require('../middleware/convertBase64File')

routes.post('/create', convertBase64ToFile, token, async(request, response) => {
    const create = await PromotionController.create(request.body)
    response.json(create)
})
routes.get('/all/:supermarket', token, async(request, response) => {
    const supermarket = request.params.supermarket
    const search = await PromotionController.detailAll({ supermarket })
    response.json(search)
})

module.exports = routes