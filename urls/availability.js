const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const availabilityController = require('../controllers/availabilityController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    const create = await availabilityController.create(request.body)
    response.json(create)
})

routes.put('/inactivate/:id', token, async(request, response) => {
    const inactivate = await availabilityController.inactivate(request.params.id)
    response.json(inactivate)
})

routes.get('/active', async(request, response) => {
    const res = await availabilityController.incativeFullData()
    response.json(res)
})

module.exports = routes