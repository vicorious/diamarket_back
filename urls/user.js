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

routes.put('/backoffice/update/:id', token, async(request, response) => {
    const _id = request.params.id
    const data = request.body
    const update = await UserController.update({ _id }, data)
    response.json(update) 
})

routes.put('/mobile/update', token, async(request, response) => {
    const _id = request.user.id
    const data = request.body
    const update = await UserController.update({ _id }, data)
    response.json(update)   
})

routes.post('/create/order', token, async(request, response) => {
    const create = await UserController.createOrder(request.body, request.user.id)
    response.json(create)
})

routes.post('/create/listproduct', token, async(request, response) => {
    const create = await UserController.createListproduct(request.body, request.user.id)
    response.json(create)
})

routes.get('/supermarketforadmin', token,async(request, response) => {
    const superMarkets = await UserController.getAdmin()
    response.json(superMarkets)
})
routes.put('/validate', async(request, response) => {
    const validate = await UserController.validate(request.body)
    response.json(validate)
})

routes.get('/userlist', token, async(request, response) => {
    const userlist = await UserController.getUserlist(request.user.id)
    response.json(userlist)
})

routes.post('/verifycode', async(request, response) => {
    const update = await UserController.updateVeryfycode(request.body.email)
    response.json(update)
})
routes.post('/resetpassword', async(request, response) => {
    const data = await UserController.updatePassword(request.body)
    response.json(data)
})
routes.get('/backoffice/detail/client/:id', token, async(request, response) => {
    const _id = request.params.id
    const data = await UserController.detailClient({ _id, rol: "client" })
    response.json(data)
})
routes.get('/mobile/detail/client', token, async(request, response)=> {
    const _id = request.user.id
    const user = await UserController.detailClient({_id, rol: "client"})
    response.json(user)
})
routes.get('/all/clients', token, async(request, response) => {
    const data = await UserController.all({ rol: "client" })
    response.json(data)
})
//Me hace falta este de count order
routes.post('/countorder', async(request, response) => {
    const count = await UserController.conuntOrder(request.body.meses)
    response.json(count)
})
routes.get('/orders', token, async(request, response) => {
    const order = await UserController.listOrder()
    response.json(order)
})
routes.post('/create/direction', token, async(request, response) => {
    const createDirection = await UserController.createDirection(request.user.id, request.body)
    response.json(createDirection)
})
routes.post('/createrandomuser', async(request, response) => {
    const create = await UserController.createData()
    response.json(create)
})

module.exports = routes