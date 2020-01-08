'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routes = asyncify(express.Router())

const { routesAuthApp, routesAuthWeb } = require('./auth')
const { routesAvailabilityWeb } = require('./availability')
const { routesUserApp, routesUserWeb } = require('./user')
const { routesSupermarketApp, routesSupermarketWeb } = require('./supermarket')
const { routesProductApp, routesProductWeb } = require('./product')
const { routesCategoryApp, routesCategoryWeb } = require('./category')
// const general = require('./general')
// const promotion = require('./promotion')
// const pqr = require('./pqr')
// const social = require('./social')
// const delivery = require('./delivery')

routes.use('/app/auth', routesAuthApp)
routes.use('/app/product', routesProductApp)
routes.use('/app/supermarket', routesSupermarketApp)
routes.use('/app/user', routesUserApp)
routes.use('/app/category', routesCategoryApp)

routes.use('/web/auth', routesAuthWeb)
routes.use('/web/supermarket', routesSupermarketWeb)
routes.use('/web/product', routesProductWeb)
routes.use('/web/availability', routesAvailabilityWeb)
routes.use('/web/user', routesUserWeb)
routes.use('/web/category', routesCategoryWeb)

module.exports = routes
