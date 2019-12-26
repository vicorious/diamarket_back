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

routes.get('/active', token, async(request, response) => {
    const res = await availabilityController.incativeFullData()
    response.json(res)
})

routes.get('/createdata', async(request, response)=>{
    const create = await availabilityController.createData()
    response.json(create)
})

module.exports = routes