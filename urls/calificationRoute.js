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
    if (data.estado === true) {
        delete data.data._doc.user
        delete data.data._doc.orderService
    } 
    console.log(data)
    response.json(data)
})

routerCalificationApp.put('/show/:id', isClient, async(request, response) => {
    const _id = request.params.id
    const update = await CalificationController.update(_id, { show: false })
    response.json(update)
})

module.exports = { routerCalificationApp }