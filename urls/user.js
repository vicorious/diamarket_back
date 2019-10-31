'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const token = require('../middleware/token')
const {convertBase64ToFile} = require('../middleware/convertBase64File')
const {isAdmin, isClient, isContability, isDriver, isEnterprise} = require('../middleware/permits')
const routes = asyncify(express.Router())
routes.post('/create', convertBase64ToFile, async (request, response) => {
    const data = request.body
    const create = await UserController.create(data)
    response.json(create)
})
routes.put('/update/:id', convertBase64ToFile, async (request, response) => {
    const _id = request.params.id
    const data = request.body
    const update = await UserController.update({_id}, data)
    response.json(update)
})
routes.get('/enterprise/:id', token, async (request, response) => {
    const idEnterprise = request.params.id
    const drivers = await UserController.detailAll({enterprise: idEnterprise})
    response.json(drivers)
})
routes.get('/detail/:id', token, async (request, response) => {
    const _id = request.params.id
    const user = await UserController.detail({_id})
    response.json(user)
})
routes.get('/all', async (request, response) => {
    const users = await UserController.detailAll({})
    response.json(users)
})
routes.get('/enterprisecode/:code', async (request, response) => {
    const uniqueCode = request.params.code
    const enterprise = await UserController.forCode(uniqueCode)
    response.json(enterprise)
})
routes.get('/enterprises', token, async (request, response) => {
    const data = await UserController.enterprises()
    response.json(data)
})
routes.get('/withenterprise/:boolean', async (request, response) => {
    const data = await UserController.withEnterprise(request.params.boolean)
    response.json(data)
})
routes.post('/verifycode', async (request, response) => {
    const update = await UserController.updateVeryfycode(request.body["email"])
    response.json(update)
})
routes.put('/validate', async (request, response) => {
    const data = await UserController.validate(request.body)
    response.json(data)
})
routes.get('/detailsCount', async (request, response) => {
    const data = await UserController.countDataDS()
    response.json(data)
})
routes.post('/resetpassword', async (request, response) => {
    const data = await UserController.updatePassword(request.body)
    response.json(data)
})
routes.get('/clients', async (request, response) => {
    const data = await UserController.detailAll({rol:"client"})
    response.json(data)
})
module.exports = routes