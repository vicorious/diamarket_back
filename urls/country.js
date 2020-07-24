'use strict'
const { Router } = require('express')
const CountryController = require('../controllers/countryController')
const routesWebCountry = Router()
const routesAppCountry = Router()

routesWebCountry.post('/create', async (request, response) => {
    console.log("?GOAKSFBASJKDABSGVDBH")
  const create = await CountryController.create(request.body)
  console.log(create)
  response.json(create)
})

routesAppCountry.get('/getall', async (request, response) => {
  const countrys = await CountryController.getAll()
  response.json(countrys)
})

module.exports = { routesWebCountry, routesAppCountry }
