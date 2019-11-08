'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const GeneralController = require('../controllers/generalController')

routes.get('/detail/general', async(request, response) => {
    const general = await GeneralController.detailgeneral()
    response.json(general)
})

module.exports = routes