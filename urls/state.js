'use strict'
const { Router } = require('express')
const StateController = require('../controllers/stateController')
const routesWebState = Router()
const routesAppState = Router()

routesWebState.post('/create', async (request, response) => {
  const create = await StateController.create(request.body)
  response.json(create)
})

routesAppState.get('/getall', async (request, response) => {
  const states = await StateController.getAll()
  response.json(states)
})

routesAppState.get('/getbycountry/:id', async (request, response) => {
  const idCountry = request.params.id
  const statesByCountry = await StateController.findByCountry(idCountry)
  response.json(statesByCountry)
})
module.exports = { routesWebState, routesAppState }
