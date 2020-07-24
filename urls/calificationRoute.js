const { Router } = require('express')
const CalificationController = require('../controllers/calificationController')
const routerCalificationApp = Router()

routerCalificationApp.put('', async (request, response) => {
    const data = request.body
    console.log(data)
    const calification = await CalificationController.calification(data)
    console.log(calification)
    response.json(calification)
})

module.exports = { routerCalificationApp }