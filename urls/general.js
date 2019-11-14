'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const GeneralController = require('../controllers/generalController')
const token = require('../middleware/token')

routes.get('/detail/general', token, async(request, response) => {
    const general = await GeneralController.detailgeneral()
    response.json(general)
})

module.exports = routes