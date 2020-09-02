'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesPromotionWeb = asyncify(express.Router())
const routesPromotionApp = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

/**
 * @swagger
 * /web/promotion:
 *  post:
 *    tags:
 *      - Promotion
 *    description: En este endpoint se registra una promocion
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *          supermarket:
 *            type: array
 *            items:
 *              type: string
 *              example: id del supermercado
 *          products:
 *            type: array
 *            items:
 *              type: string
 *              example: id de mongo
 *              required: true
 *          value:
 *            type: number
 *            required: true
 *          credits:
 *            type: number
 *          discount:
 *            type: number
 *          image:
 *            type: array
 *            items:
 *              type: string
 *              example: base 64 de la imagen
 *              required: true
 *          isActive:
 *            type: boolean
 *          initDate:
 *            type: string
 *            required: true
 *          finishDate:
 *            type: string
 *            required: true
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si la promocion se registra exitosamente se devuelve el siguiente objeto
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
 *                  example: '5dc3493ee92df70280d9a63d'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la promocion no se registra se devuelve el siguiente error
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
 *              example: No se pudo crear la promocion
 */
routesPromotionWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await PromotionController.create(data)
  response.json(create)
})
/**
 * @swagger
 * /web/promotion/{idPromotion}:
 *  put:
 *    tags:
 *      - Promotion
 *    description: En este endpoint se actualiza una promocion
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: idPromotion
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *          supermarket:
 *            type: string
 *            required: true
 *            example: id de mongo
 *          products:
 *            type: array
 *            items:
 *              type: string
 *              example: id de mongo
 *              required: true
 *          value:
 *            type: number
 *            required: true
 *          credits:
 *            type: number
 *          discount:
 *            type: number
 *          image:
 *            type: array
 *            items:
 *              type: string
 *              example: base 64 de la imagen
 *              required: true
 *          isActive:
 *            type: boolean
 *          initDate:
 *            type: string
 *            required: true
 *          finishDate:
 *            type: string
 *            required: true
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si la promocion se actualizo exitosamente se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                updated:
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
 *              example: No se pudo actualizar la promocion
 */
routesPromotionWeb.put('/:id', isSuperAdmin, convertBase64ToFile, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await PromotionController.update({ _id }, data)
  response.status(200).json(update)
  return
})

/**
 * @swagger
 * /web/promotion/detail/{id}:
 *  get:
 *    tags:
 *      - Promotion
 *    description: En este endpoint se detalla una promocion por el id enviado en cabecera
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: Si se encuentra la promocion se devuelve el objeto de la promocion
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Promotion'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la promocion no existe devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: 'Array vacio'
 *            mensaje:
 *              type: string
 *              example: 'La promocion no se encuentra registrada'
 */
routesPromotionWeb.get('/detail/:id', isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await PromotionController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /web/promotion/{quantity}/{page}:
 *  get:
 *    tags:
 *      - Promotion
 *    description: En este endpoint lista todas las promociones
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: quantity
 *      required: true
 *    - in: path
 *      name: page
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las promociones registradas en la base de datos
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref : '#/definitions/Promotion'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no existen promociones se devuelve el siguiente objeto
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
 *              example: No existen promociones
 */
routesPromotionWeb.get('/:quantity/:page', isSuperAdmin, async (request, response) => {
  const quantity = request.params.quantity
  const page = request.params.page
  const query = request.query
  if (query.supermarket) {
    const promotions = await PromotionController.allPage(query, quantity, page)
    response.json(promotions)
  } else if (query.name) {
    query.name = { $regex: query.name, $options: 'i' }
    const promotions = await PromotionController.allPage(query, quantity, page)
    response.json(promotions)
  } else {
    const promotions = await PromotionController.allPage({}, quantity, page)
    response.json(promotions)
  }
})

/**
 * @swagger
 * /web/promotion/forsupermarket/{quantity}/{page}:
 *  get:
 *    tags:
 *      - Promotion
 *    description: En este endpoint lista todas las promociones que tiene asignadas un supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: quantity
 *      required: true
 *    - in: path
 *      name: page
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan todas las promociones registradas en la base de datos
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref : '#/definitions/Promotion'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no existen promociones se devuelve el siguiente objeto
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
 *              example: No hay promociones para este supermercado
 */
routesPromotionWeb.get('/forsupermarket/:quantity/:page', isAdmin, async (request, response) => {
  const quantity = request.params.quantity
  const page = request.params.page
  const _id = request.User.id
  const query = request.query
  console.log(quantity, page, _id, query)
  const promotions = await PromotionController.forSuperMarket(_id, query, quantity, page)
  response.json(promotions)
})

/**
 * @swagger
 * /app/promotion/all/{supermarket}/{initquantity}/{finishquantity}:
 *  get:
 *    tags:
 *      - Promotion
 *    description: En este endpoint lista todas las promociones segun el supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: supermarket
 *      type: string
 *      required: true
 *    - in: path
 *      name: initquantity
 *      type: string
 *      required: true
 *    - in: path
 *      name: finishquantity
 *      type: string
 *      requuired: true
 *    responses:
 *      200:
 *        description: Si el id del supermercado tiene promociones se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref : '#/definitions/Promotion'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no existen promociones se devuelve el siguiente objeto
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
 *              example: No existen promociones para este supermercado
 */
routesPromotionApp.get('/all/:supermarket/:initquantity/:finishquantity', async (request, response) => {
  const initQuantity = request.params.initquantity
  const finishQuantity = request.params.finishquantity
  const supermarket = request.params.supermarket
  const data = { supermarket: supermarket, isActive: true }
  const search = await PromotionController.all(data, initQuantity, finishQuantity)
  response.json(search)
})

/**
 * @swagger
 * /app/promotion/detail/{id}:
 *  get:
 *    tags:
 *      - Promotion
 *    description: En este endpoint se detalla una promocion por el id enviado en cabecera
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: Si se encuentra la promocion se devuelve el objeto de la promocion
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Promotion'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la promocion no existe devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: 'Array vacio'
 *            mensaje:
 *              type: string
 *              example: 'La promocion no se encuentra registrada'
 */
routesPromotionApp.get('/detail/:id', async (request, response) => {
  const _id = request.params.id
  const detail = await PromotionController.detailApp({ _id })
  response.json(detail)
})


module.exports = { routesPromotionApp, routesPromotionWeb }
