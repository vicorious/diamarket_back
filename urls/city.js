'use strict'
const { Router } = require('express')
const CityController = require('../controllers/cityController')
const routesWebCity = Router()
const routesAppCity = Router()

routesWebCity.post('/create', async (request, response) => {
  const create = await CityController.create(request.body)
  response.json(create)
})

routesAppCity.get('/getall', async (request, response) => {
  const citys = await CityController.getAll()
  response.json(citys)
})

routesAppCity.get('/getbystate/:id', async (request, response) => {
  const idState = request.params.id
  const citys = await CityController.findByState(idState)
  response.json(citys)
})
module.exports = { routesWebCity, routesAppCity }
