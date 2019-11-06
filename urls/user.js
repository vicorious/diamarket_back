'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const token = require('../middleware/token')
const routes = asyncify(express.Router())

routes.post('/create', async(request, response) => {
    const data = request.body
    const create = await UserController.create(data)
    response.json(create)
})
routes.post('/create/order',token, async(request, response) => {
    const create = await UserController.createOrder(request.body,request.user.id)
    response.json(create)
})
routes.get('/admin', async(request, response) => {
    const getAdmin = await UserController.getAdmin()
    response.json(getAdmin)
})
routes.put('/validate', async(request, response) => {
    const validate = await UserController.validate(request.body)
    response.json(validate)
})

routes.post('/verifycode', async(request, response) => {
    const update = await UserController.updateVeryfycode(request.body["email"])
    response.json(update)
})
routes.post('/resetpassword', async(request, response) => {
    const data = await UserController.updatePassword(request.body)
    response.json(data)
})
routes.get('/detail/client/:id', async(request, response) => {
    const _id = request.params.id
    const data = await UserController.detail({_id,rol:"client"})
    response.json(data)
})
routes.get('/detail/clients', async(request, response) => {
    const data = await UserController.detailAll({rol:"client"})
    response.json(data)
})
routes.put('/update/:id', async(request, response) => {
    const _id = request.params.id
    const data = await UserController.update(_id, request.body)
    response.json(data)
})

module.exports = routes