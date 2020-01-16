const express = require('express')
const asyncify = require('express-asyncify')
const routesDeliveryWeb = asyncify(express.Router())
// const { isDomiciliary } = require('../middleware/token')
const DeliveryController = require('../controllers/deliveryController')

routesDeliveryWeb.post('', async (request, response) => {
  const data = request.body
  const create = await DeliveryController.create(data)
  response.json(create)
})
routesDeliveryWeb.put('/:id', async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await DeliveryController.update({ _id }, data)
  response.json(update)
})
routesDeliveryWeb.get('/detail/:id', async (request, response) => {
  const _id = request.params.id
  const detail = await DeliveryController.detail({ _id })
  response.json(detail)
})

module.exports = { routesDeliveryWeb }
