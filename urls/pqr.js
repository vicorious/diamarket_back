'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const PqrController = require('../controllers/pqrController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    request.body.userId = request.user.id
    console.log(request.user.id);
    const create = await PqrController.create(request.body)
    response.json(create)
})

routes.get('/all', token, async(request, response) => {
    const all = await PqrController.getAll()
    response.json(all)
})

routes.get('/detail/:id', token, async(request, response) => {
    const detail = await PqrController.getFirst(request.params.id)
    response.json(detail)
})

routes.put('/update/:id', token, async(request, response) => {
    const update = await PqrController.update(request.params.id, request.body)
    response.json(update)
})

module.exports = routes