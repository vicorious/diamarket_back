const { Router } = require('express')
const CalificationController = require('../controllers/calificationController')
const { isClient } = require('../middleware/token')
const routerCalificationApp = Router()

routerCalificationApp.put('', async (request, response) => {
    const data = request.body
    console.log(data)
    const calification = await CalificationController.calification(data)
    console.log(calification)
    response.json(calification)
})

routerCalificationApp.get('/without', isClient, async(request, response) => {
    const user = request.User.id
    const data = await CalificationController.detail({ user, show: true, calification: { $gte: 0 } })
    response.json(data)
})

module.exports = { routerCalificationApp }