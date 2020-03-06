'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesPromotionWeb = asyncify(express.Router())
const routesPromotionApp = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
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
  response.json(update)
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
routesPromotionWeb.get('/detail/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await PromotionController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /web/promotion:
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
routesPromotionWeb.get('', isSuperAdmin, async (request, response) => {
  const query = request.query
  if (query.supermarket) {
    const promotions = await PromotionController.all(query)
    response.json(promotions)
  } else if (query.name) {
    query.name = { $regex: query.name, $options: 'i' }
    const promotions = await PromotionController.all(query)
    response.json(promotions)
  } else {
    const promotions = await PromotionController.all({})
    response.json(promotions)
  }
})

/**
 * @swagger
 * /web/promotion/forsupermarket:
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
routesPromotionWeb.get('/forsupermarket', isAdmin, async (request, response) => {
  const _id = request.User.id
  const query = request.query
  const promotions = await PromotionController.forSuperMarket(_id, query)
  response.json(promotions)
})

/**
 * @swagger
 * /app/promotion/all/{supermarket}:
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
routesPromotionApp.get('/all/:supermarket', isClient, async (request, response) => {
  const supermarket = request.params.supermarket
  const data = { supermarket: supermarket, isActive: true }
  const search = await PromotionController.all(data)
  response.json(search)
})

module.exports = { routesPromotionApp, routesPromotionWeb }
