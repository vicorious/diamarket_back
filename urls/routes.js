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
const { routesPqrApp, routesPqrWeb } = require('./pqr')
const { routesPromotionApp, routesPromotionWeb } = require('./promotion')
const { routesDeliveryWeb } = require('./delivery')
const { routesUserListApp } = require('./userList')
const { routeSwaggerWeb } = require('./swagger')

routes.use('/app/auth', routesAuthApp)
routes.use('/app/product', routesProductApp)
routes.use('/app/supermarket', routesSupermarketApp)
routes.use('/app/user', routesUserApp)
routes.use('/app/category', routesCategoryApp)
routes.use('/app/pqr', routesPqrApp)
routes.use('/app/promotion', routesPromotionApp)
routes.use('/app/userlist', routesUserListApp)

routes.use('/web/auth', routesAuthWeb)
routes.use('/web/supermarket', routesSupermarketWeb)
routes.use('/web/product', routesProductWeb)
routes.use('/web/availability', routesAvailabilityWeb)
routes.use('/web/user', routesUserWeb)
routes.use('/web/category', routesCategoryWeb)
routes.use('/web/pqr', routesPqrWeb)
routes.use('/web/promotion', routesPromotionWeb)
routes.use('/web/delivery', routesDeliveryWeb)

routes.use('/swagger', routeSwaggerWeb)

module.exports = routes
