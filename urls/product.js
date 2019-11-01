'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())

routes.post('/create', async(request, response) => {

})

module.exports = routes