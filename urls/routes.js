'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())

const user = require('./user')
const auth = require('./auth')
const availability = require('./availability')
const supermarket = require('./supermarket')
const product = require('./product')
const category = require('./category')
const general = require('./general')
const promotion = require('./promotion')

routes.use('/user', user)
routes.use('/auth', auth)
routes.use('/availability', availability)
routes.use('/supermarket', supermarket)
routes.use('/product', product)
routes.use('/category', category)
routes.use('/promotion', promotion)
routes.use('/', general)

module.exports = routes