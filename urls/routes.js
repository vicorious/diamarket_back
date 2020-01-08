'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())

const { routesAuthApp, routesAuthWeb } = require('./auth')
const { routesUserApp, routesUserWeb } = require('./user')
// const availability = require('./availability')
const { routesSupermarketApp, routesSupermarketWeb } = require('./supermarket')
// const product = require('./product')
// const category = require('./category')
// const general = require('./general')
// const promotion = require('./promotion')
// const pqr = require('./pqr')
// const social = require('./social')
// const delivery = require('./delivery')

// routes.use('/user', user)
// routes.use('/auth', routesAuth)
// routes.use('/availability', availability)
// routes.use('/supermarket', supermarket)
// routes.use('/product', product)
// routes.use('/category', category)
// routes.use('/promotion', promotion)
// routes.use('/pqr', pqr)
// routes.use('/social', social)
// routes.use('/delivery', delivery)
// routes.use('/', general)

routes.use('/app/auth', routesAuthApp)
routes.use('/app/supermarket', routesSupermarketApp)
routes.use('/app/user', routesUserApp)

routes.use('/web/auth', routesAuthWeb)
routes.use('/web/supermarket', routesSupermarketWeb)
routes.use('/web/app', routesUserWeb)

module.exports = routes
