'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const categoryController = require('../controllers/categoryController')
const token = require('../middleware/token')

routes.post('/create', token, async(request, response) => {
    const create = await categoryController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', token, async(request, response) => {
    const id = request.params.id
    const update = await categoryController.update(id, request.body)
    response.json(update)
})

routes.get('/all', token, async(request, response) => {
    const all = await categoryController.detailAll()
    response.json(all)
})

module.exports = routes