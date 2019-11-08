'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const PqrController = require('../controllers/pqrController')

routes.post('/create', async(request, response) => {
    const create = await PqrController.create(request.body)
    response.json(create)
})

module.exports = routes