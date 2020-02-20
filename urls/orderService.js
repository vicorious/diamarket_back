const express = require('express')
const asyncify = require('express-asyncify')
const OrderServiceController = require('../controllers/orderServiceController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const routesOrderServiceApp = asyncify(express.Router())
const routesOrderServiceWeb = asyncify(express.Router())

/**
 * @swagger
 * /web/orderservice:
 *  get:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se traen todas las ordenes de servicio
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las ordenes de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/OrderService'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: no se listan ordenes
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: No hay ordenes registradas
 */
routesOrderServiceWeb.get('', isSuperAdmin, async (request, response) => {
  const data = await OrderServiceController.all({})
  response.json(data)
})

/**
 * @swagger
 * /web/orderservice/detail/{id}:
 *  get:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se detalla una orden de servicio
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: id
 *      type: string
 *      required: tru
 *    responses:
 *      200:
 *        description: Se detalla una orden de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/OrderService'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: No se detalla la orden
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: La orden no se encuentra registrada
 */
routesOrderServiceWeb.get('/detail/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const order = await OrderServiceController.detail({ _id })
  response.json(order)
})

/**
 * @swagger
 * /web/orderservice/forsupermarket:
 *  get:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se traen todas las ordenes de servicio de un supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las ordenes de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/OrderService'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: no se listan ordenes
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: No hay ordenes registradas
 */
routesOrderServiceWeb.get('/forsupermarket', isAdmin, async (request, response) => {
  const idAdmin = request.User.id
  const orders = await OrderServiceController.forSupermarket({ idAdmin })
  response.json(orders)
})

routesOrderServiceWeb.put('/:id', async (request, response) => {
  const data = request.body
  const _id = request.params.id
  const order = await OrderServiceController.edit({ _id }, data)
  response.json(order)
})

/**
 * @swagger
 * /app/orderservice:
 *  post:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se crea una orden de servicio
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          referenceCode:
 *            type: string
 *            example: referencia de pago de payu
 *          direction:
 *            type: object
 *            properties:
 *              address:
 *                type: string
 *                example: cra 7 # 6-16
 *              location:
 *                type: object
 *                properties:
 *                  type:
 *                    type: string
 *                    example: Point
 *                  coordinates:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: 4.6564955, -74.0652501
 *          methodPayment:
 *            type: string
 *            example: credit
 *          superMarket:
 *            type: string
 *            example: id de mongo del supermercado
 *          products:
 *            type: array
 *            items:
 *              properties:
 *                product:
 *                  type: string
 *                  example: id de mongo del producto
 *                quantity:
 *                  type: number
 *                  example: 5
 *          promotions:
 *            type: array
 *            items:
 *              properties:
 *                promotion:
 *                  type: string
 *                  example: id de mongo de la promocion
 *                quantity:
 *                  type: number
 *                  example: 1
 *          value:
 *            type: number
 *            example: 412321
 *    responses:
 *      200:
 *        description: Se crea la orden de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: no se crea la orden de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: no se ha podido crear la orden de servicio
 */
routesOrderServiceApp.post('', isClient, async (request, response) => {
  const data = request.body
  data.status = 0
  data.user = request.User.id
  const order = await OrderServiceController.create(data)
  response.json(order)
})

/**
 * @swagger
 * /app/orderservice:
 *  get:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se traen todas las ordenes de servicio segun el cliente
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las ordenes de servicio del cliente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/OrderService'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: no se listan ordenes
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: El cliente no tiene ordenes registradas
 */
routesOrderServiceApp.get('', isClient, async (request, response) => {
  const user = request.User.id
  const data = await OrderServiceController.all({ user })
  response.json(data)
})

/**
 * @swagger
 * /app/orderservice/detail/{id}:
 *  get:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se detalla una orden de servicio
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: id
 *      type: string
 *      required: tru
 *    responses:
 *      200:
 *        description: Se detalla una orden de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/OrderService'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: No se detalla la orden
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              example: []
 *            mensaje:
 *              type: string
 *              example: La orden no se encuentra registrada
 */
routesOrderServiceApp.get('/detail/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const order = await OrderServiceController.detail({ _id })
  response.json(order)
})

module.exports = { routesOrderServiceApp, routesOrderServiceWeb }
