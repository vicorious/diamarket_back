'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const categoryController = require('../controllers/categoryController')
const token = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')


routes.post('/create', convertBase64ToFile, token, async(request, response) => {
    const create = await categoryController.create(request.body)
    response.json(create)
})

routes.put('/update/:id', convertBase64ToFile, token, async(request, response) => {
    const id = request.params.id
    const update = await categoryController.update(id, request.body)
    response.json(update)
})

routes.get('/detail/:id', token, async(request, response) => {
    const detail = await categoryController.detail(request.params.id)
    response.json(detail)
})

routes.put('/inactivate/:id', token, async(request, response) => {
    const inactivate = await categoryController.inactivate(request.params.id)
    response.json(inactivate)
})

routes.get('/all', token, async(request, response) => {
    const all = await categoryController.all()
    response.json(all)
})

module.exports = routes