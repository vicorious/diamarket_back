const express = require('express')
const asyncify = require('express-asyncify')
const availabilityController = require('../controllers/availabilityController')
const { isSuperAdmin, isAdmin } = require('../middleware/token')
const routesAvailabilityWeb = asyncify(express.Router())

routesAvailabilityWeb.post('/create', isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await availabilityController.create(data)
  response.json(create)
})

routesAvailabilityWeb.put('/update/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await availabilityController.update({ _id }, data)
  response.json(update)
})

// routes.get('/avaData', async (request, response) => {
//   const create = await availabilityController.availibilityData()
//   response.json(create)
// })

module.exports = { routesAvailabilityWeb }
