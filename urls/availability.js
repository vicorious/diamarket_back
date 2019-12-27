const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const availabilityController = require('../controllers/availabilityController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    const create = await availabilityController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', token, async(request, response) => {
    const update = await availabilityController.update(request.params.id, request.body)
    response.json(update)
})

routes.get('/avaData', async(request, response)=>{
    const create = await availabilityController.availibilityData()
    response.json(create)
})

module.exports = routes