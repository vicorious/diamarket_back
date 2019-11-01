'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())

const user = require('./user')
const auth = require('./auth')
const availability = require('./availability')
const supermarket = require('./supermarket')
const product = require('./product')

routes.use('/user', user)
routes.use('/auth', auth)
routes.use('/availability', availability)
routes.use('/supermarket', supermarket)
routes.use('/product', product)

module.exports = routes