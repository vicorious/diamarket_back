'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const DashboardController = require('../controllers/dashboardController')
const { isAdminAndIsSuperAdmin } = require('../middleware/token')
const routesDashboardWeb = asyncify(express.Router())

/**
 * @swagger
 * /web/dashboard/count:
 *  get:
 *    tags:
 *      - Dashboard
 *    description: Este endpoint lista los numeros para las targetas
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Responde el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                supermarketAll:
 *                  type: number
 *                  example: 3
 *                clientAll:
 *                  type: number
 *                  example: 10
 *                serviceAll:
 *                  type: number
 *                  example: 4
 *                promotionAll:
 *                  type: number
 *                  example: 50
 *                supermarketNew:
 *                  type: number
 *                  example: 10
 *                serviceFinish:
 *                  type: number
 *                  example: 50
 *                serviceWait:
 *                  type: number
 *                  example: 40
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no se encuentra la orden
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: array vacio
 *            mensaje:
 *              type: string
 *              example: "No se ha encontrado la orden"
 */
routesDashboardWeb.get('/count', isAdminAndIsSuperAdmin, async (request, response) => {
  if (request.User.rol === 'superadministrator') {
    const count = await DashboardController.targetCounter()
    response.json(count)
  } else {
    const count = await DashboardController.targetCounter()
    response.json(count)
  }
})

routesDashboardWeb.post('/countorder', async (request, response) => {
  const month = request.body.meses
  const data = await DashboardController.countOrder(month)
  response.json(data)
})

module.exports = { routesDashboardWeb }
