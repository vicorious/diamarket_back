const express = require('express')
const asyncify = require('express-asyncify')
const routesDeliveryWeb = asyncify(express.Router())
const { isDomiciliary } = require('../middleware/token')
const DeliveryController = require('../controllers/deliveryController')

routesDeliveryWeb.get('', isDomiciliary, async (request, response) => {
  const idUser = request.User.id
  const orders = await DeliveryController.all({ idUser })
  response.json(orders)
})

routesDeliveryWeb.get('/detail/:id', isDomiciliary, async (request, response) => {
  const _id = request.params.id
  const order = await DeliveryController.detail({ _id })
  response.json(order)
})

routesDeliveryWeb.put('/:id', isDomiciliary, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const order = await DeliveryController.edit(_id, data)
  response.json(order)
})

module.exports = { routesDeliveryWeb }
