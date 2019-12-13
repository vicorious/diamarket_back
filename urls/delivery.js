const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const token = require('../middleware/token')
const deliveryController = require('../controllers/deliveryController')

routes.post('/create', token, async(request, response) => {
    const create = await deliveryController.create(request.body)
    response.json(create)
})
routes.put('/update/:id', token, async(request, response) => {
    const update = await deliveryController.update(request.params.id, request.body)
    response.json(update)
})
routes.get('/detail/:id', token, async(request, response) => {
    const detail = await deliveryController.detail(request.params.id)
    response.json(detail)
})

module.exports = routes