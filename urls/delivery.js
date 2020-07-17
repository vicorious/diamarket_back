const express = require('express')
const asyncify = require('express-asyncify')
const routesDeliveryWeb = asyncify(express.Router())
const { isDomiciliary } = require('../middleware/token')
const DeliveryController = require('../controllers/deliveryController')

/**
 * @swagger
 * /web/delivery:
 *  get:
 *    tags:
 *      - Domiciliario
 *    description: En este endpoint se traen todas las ordenes de servicio asignadas al domiciliario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las ordenes de servicio asignadas al domiciliario
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Delivery'
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
routesDeliveryWeb.get('', isDomiciliary, async (request, response) => {
  const idUser = request.User.id
  const orders = await DeliveryController.all({ idUser })
  response.json(orders)
})

/**
 * @swagger
 * /web/delivery/detail/{idDelivery}:
 *  get:
 *    tags:
 *      - Domiciliario
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
 *      example: _id del delivey
 *      required: true
 *    responses:
 *      200:
 *        description: Se detalla una orden de servicio
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Delivery'
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
routesDeliveryWeb.get('/detail/:id', isDomiciliary, async (request, response) => {
  const _id = request.params.id
  const order = await DeliveryController.detail({ _id })
  response.json(order)
})

/**
 * @swagger
 * /web/delivery/{idDelivery}:
 *  put:
 *    tags:
 *      - Domiciliario
 *    description: en este endpoint solamente se resiven los estado, status = 1 para decir que inicio, status = 2 para decir que llegue, status = 3 para decir entregado, status = 4 cancelar pero junto a este hay que enviar el  codeCancelation para validar que el domiciliario pueda cancelar la orden
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: idDelivery
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          status:
 *            type: number
 *            example:  status = 1 (Inicio), satus = 2 (Llegue), status = 3 (Entregado), status = 4 (Cancelado)
 *          codeCancelation:
 *            type: string
 *            example: este campo solamente se envia cuando el domiciliario vaya a cancelar la solicutud
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si la orden de servicio se actualiza correctamente se devuelve el siguiente objeto
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
 *        description: Si la promocion no se actualiza se devuelve el siguiente error
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
 *              example: No se pudo actualizar la orden
 */
routesDeliveryWeb.put('/:id', isDomiciliary, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const order = await DeliveryController.edit(_id, data, request.io)
  response.json(order)
})

module.exports = { routesDeliveryWeb }
