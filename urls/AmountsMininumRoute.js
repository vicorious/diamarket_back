const { Router } = require('express')
const routeAmountMininumWeb = Router()
const AmountMininumController = require('../controllers/amountsMininumController')

routeAmountMininumWeb.post('', async (request, response) => {
    const data = request.body
    const create = await AmountMininumController.create(data)
    response.json(create)
})

routeAmountMininumWeb.get('/detail', async (request, response) => {
    const data = await AmountMininumController.detail()
    response.json(data)
})

routeAmountMininumWeb.put('/:id', async (request, response) => {
    const _id = request.params.id
    const data = request.body
    const update = await AmountMininumController.update(data, _id)
    response.json(update)
})

module.exports = { routeAmountMininumWeb }