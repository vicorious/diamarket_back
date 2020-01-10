const express = require('express')
const asyncify = require('express-asyncify')
const OrderServiceController = require('../controllers/orderServiceController')
const { isClient } = require('../middleware/token')
const routesOrderServiceApp = asyncify(express.Router())
const routesOrderServiceWeb = asyncify(express.Router())

/**
 * @swagger
 * /app/orderservice:
 *  post:
 *    tags:
 *      - OrderService
 *    description: Este endpoint crea la orden de un usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      type: object
 *      schema:
 *          properties:
 *            direction:
 *              type: string
 *              example: "Cll 123 # 1 - 12"
 *            methodPayment:
 *              type: string
 *              example: "Efectivo"
 *            superMarket:
 *              type: string
 *              example: "5e178280c02a1c04e0dcc67b"
 *            products:
 *              type: array
 *              items:
 *                type: string
 *                example: "5e178280c02a1c04e0dcc67b, 5dd5b8c1f4e3a1511ad7c310"
 *            promotions:
 *              type: array
 *              items:
 *                type: string
 *                example: "5e178280c02a1c04e0dcc67b"
 *    responses:
 *      200:
 *        description: Si la orden se creo correctamente
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
 *                  example: "5e178280c02a1c04e0dcc67b"
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si se da un error al crear la orden
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
 *              example: "Error al crear la orden"
 */

routesOrderServiceApp.post('', isClient, async (request, response) => {
  const user = request.User.id
  const data = request.body
  const create = await OrderServiceController.create(user, data)
  response.json(create)
})

/**
 * @swagger
 * /app/orderservice/{id}:
 *  put:
 *    tags:
 *      - OrderService
 *    description: Este endpoint actualiza el estado de la orden
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
 *      required: true
 *    - in: body
 *      name: body
 *      type: object
 *      schema:
 *          properties:
 *            status:
 *              type: number
 *              example: "1"
 *    responses:
 *      200:
 *        description: Si la orden se actualizo corretamente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                update:
 *                  type: boolean
 *                  example: true
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

routesOrderServiceApp.put('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await OrderServiceController.update({ _id }, data)
  response.json(update)
})

/**
 * @swagger
 * /app/orderservice/{id}:
 *  get:
 *    tags:
 *      - OrderService
 *    description: Este endpoint actualiza el estado de la orden
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
 *      required: true
 *    responses:
 *      200:
 *        description: Si encuentra la orden retorna el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              $ref: '#/definitions/OrderService'
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

routesOrderServiceApp.get('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const order = await OrderServiceController.detail({ _id })
  response.json(order)
})

/**
 * @swagger
 * /app/orderservice:
 *  get:
 *    tags:
 *      - OrderService
 *    description: Este endpoint actualiza el estado de la orden
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si encuentra la orden retorna el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/OrderService'
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
 *              example: "No se han encontrado ordenes"
 */

routesOrderServiceApp.get('', isClient, async (request, response) => {
  const user = request.User.id
  const orders = await OrderServiceController.allForClien({ user })
  response.json(orders)
})

module.exports = { routesOrderServiceApp, routesOrderServiceWeb }
