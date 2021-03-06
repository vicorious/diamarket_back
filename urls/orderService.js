const express = require('express')
const asyncify = require('express-asyncify')
const OrderServiceController = require('../controllers/orderServiceController')
const CalificationController = require('../controllers/calificationController')
const PayUController = require('../controllers/payUController')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin } = require('../middleware/token')
const moment = require('moment')
const routesOrderServiceApp = express.Router()
const routesOrderServiceWeb = express.Router()

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
routesOrderServiceWeb.get('/isimmediate/:isImmediate', isSuperAdmin, async (request, response) => {
  if(request.params.isImmediate === 'false'){
    const { _d } = moment().set('date' ,moment().get('date') + 1).set('hours', 00).set('minutes', 00)
    const data = await OrderServiceController.all({ dateService: { $gte: _d}})
    response.json(data)
  } else {
    const hourInit = moment().set('hours', 00).set('minutes', 00)
    const hourFinish = moment().set('hours', 23).set('minutes', 59)
    const data = await OrderServiceController.all({ $and: [{dateService: { $gte: hourInit._d }}, {dateService: { $lte: hourFinish._d }} ]})
    response.json(data)
  }
})

routesOrderServiceWeb.get('/history', async(request, response) => {
  const date = moment().set('hours', 00).set('minutes', 00)
  const data = await OrderServiceController.all({ dateService: { $lte: date._d } })
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
routesOrderServiceWeb.get('/detail/:id', isAdminAndIsSuperAdmin, async (request, response) => {
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
routesOrderServiceWeb.get('/forsupermarket/isImmediate/:isImmediate', isAdmin, async (request, response) => {
  const idAdmin = request.User.id
  if(request.params.isImmediate === 'false'){
    const { _d } = moment().set('date' ,moment().get('date') + 1).set('hours', 00).set('minutes', 00)
    const data = await OrderServiceController.forSupermarket({idAdmin}, {dateService: [{ dateService: { $gte: _d}}]})
    response.json(data)
  } else {
    const hourInit = moment().set('hours', 00).set('minutes', 00)
    const hourFinish = moment().set('hours', 23).set('minutes', 59)
    const data = await OrderServiceController.forSupermarket({idAdmin}, { dateService: [{dateService: { $gte: hourInit._d }}, {dateService: { $lte: hourFinish._d }} ] })
    response.json(data)
  }
})

routesOrderServiceWeb.get('/forsupermarket/history', isAdmin, async(request, response) => {
  const idAdmin = request.User.id
  const date = moment().set('hours', 00).set('minutes', 00)
  console.log("-------.--.-.-")
  console.log(date.format('YYYY-MM-DD HH:mm'))
  const data = await OrderServiceController.forSupermarket({idAdmin}, { dateService: [ {dateService: {$lte: date._d}} ] })
  response.json(data)
})

/**
 * @swagger
 * /web/orderservice/{idOrder}:
 *  put:
 *    tags:
 *      - OrderService
 *    description: en este endpoint solamente resivo dos estados status = 1 para decir que es aceptado, status = 2 junto al idUser = string de mongo de esta forma es asignado al domiciliario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: idOrder
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          status:
 *            type: number
 *            example:  estado 1 para aceptado estado 2 para asignado
 *          idUser:
 *            type: string
 *            example: exte campo solamente se envia cuando se asigne el domiciliario y es el id del domiciliario en string
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
routesOrderServiceWeb.put('/:id', async (request, response) => {
  const data = request.body
  const _id = request.params.id
  const order = await OrderServiceController.edit({ _id }, data, request.io)
  response.json(order)
})

/**
 * @swagger
 * /app/orderservice/calculatevalue:
 *  post:
 *    tags:
 *      - OrderService
 *    description: En este endpoint se calcula el valor de la orden de servicio
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
 *          products:
 *            type: array
 *            items:
 *              properties:
 *                product:
 *                  type: string
 *                  example: id de mongo
 *                quantity:
 *                  type: number
 *                  example: 5
 *          promotions:
 *            type: array
 *            items:
 *              properties:
 *                promotion:
 *                  type: string
 *                  example: id de mongo
 *                quantity:
 *                  type: number
 *                  example: 5
 *    responses:
 *      200:
 *        description: se devuelve el valor calculado
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: number
 *              example: 1000
 *            mensaje:
 *              type: string
 *              example: null
 */
routesOrderServiceApp.post('/calculatevalue', isClient, async (request, response) => {
  // const data = request.body
  // data.user = request.User.id
  const value = await OrderServiceController.calculateValue()
  response.json(value)
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
 *          description:
 *            type: string
 *          value:
 *            type: number
 *          methodPayment:
 *            type: string
 *            example: credit
 *          card:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                example: VISA
 *              number:
 *                type: string
 *                example: 4456529125264266
 *              securityCode:
 *                type: string
 *                example: 457
 *              expirationDate:
 *                type: string
 *                example: 2023/01 primero el año luego el mes
 *              name: 
 *                type: string
 *                example: visa
 *              identification:
 *                type: string
 *                example: 1013692738
 *              uid:
 *                type: string
 *                example: si es una tarjeta ya registrada msolamente me envian el uid
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
 *              example: La red financiera reportó que la transacción fue inválida.
 */
routesOrderServiceApp.post('', isClient, async (request, response) => {
  const data = request.body
  data.status = 0
  data.user = request.User.id 
  // data.user = '5e436d7d563c85275c82fc8b'
  const order = await OrderServiceController.create(data,request.io.io)
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
  // const user = "5eda8e981fe0e360948a9cc6"
  const { filter } = request.query
  if (filter.toString() === 'true') {
    const data = await OrderServiceController.allProduct({ $and: [{ user }, { $or: [{ status: 0 }, { status: 1 }, { status: 2 }, { status: 3 }]}]})
    response.json(data)
  } else {
    const data = await OrderServiceController.allProduct({  $and: [{ user }, { $or: [{ status: 4}, { status: 5 }]}]})
    if (data.estado === true) {
      for (const object of data.data) {
        const calification = await (await CalificationController.detail({ orderService: object._id })).data
        if (calification._id) {
          delete calification._doc.orderService
          delete calification._doc.user
          object._doc.calification = calification
        }
      }
    }
    response.json(data)
  }  
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
routesOrderServiceApp.get('/detail/:id', async (request, response) => {
  const _id = request.params.id
  const order = await OrderServiceController.detailApp({ _id })
  response.json(order)
})

routesOrderServiceApp.put('/cancel', isClient, async (request, response) => {

  const _id = request.body._id
  const order = await OrderServiceController.cancel({_id})
  response.json(order)
})


routesOrderServiceApp.get('/datapse', async (request, response) => {
  const banks = await PayUController.dataPse()
  response.json(banks)
})

routesOrderServiceWeb.post('/responsepayment', async (request, response) => {
  response.json(true)
})

routesOrderServiceApp.all('/responsepaymentpse', async (request, response) => {
  console.log("HOLAAA")
  if (request.method.toString() === 'POST') {
    await OrderServiceController.validateResponsePaymentPse(request.body, request.io)
  } else {
    await OrderServiceController.validateResponsePaymentPse(request.query, request.io)
  }
  response.json(true)
})

routesOrderServiceWeb.get('/cronjob', async (request, response) => {
  const cron = await OrderServiceController.cronJob()
  response.json(cron)
})

routesOrderServiceWeb.get('/report/:dateInit/:dateFinish', isAdminAndIsSuperAdmin, async(request, response) => {
  const file = await OrderServiceController.report(request.User.id, request.User.rol, moment(request.params.dateInit), moment(request.params.dateFinish))
  // const file = await OrderServiceController.report(11111111, 'superadministrator', moment(request.params.dateInit), moment(request.params.dateFinish))
  response.download(file)
})

// routesOrderServiceWeb('/responsepaymentpse', async (request, response) => {
  
  
//   response.json(true)
// })

module.exports = { routesOrderServiceApp, routesOrderServiceWeb }
