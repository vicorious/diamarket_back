const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())
const availabilityController = require('../controllers/availabilityController')

routes.post('/create', async(request, response) => {

})

module.exports = routes