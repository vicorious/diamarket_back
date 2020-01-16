'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesPromotionWeb = asyncify(express.Router())
const routesPromotionApp = asyncify(express.Router())
const PromotionController = require('../controllers/promotionController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesPromotionWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await PromotionController.create(data)
  response.json(create)
})
routesPromotionWeb.put('/:id', isSuperAdmin, convertBase64ToFile, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await PromotionController.update({ _id }, data)
  response.json(update)
})
routesPromotionWeb.get('/all/:supermarket', isSuperAdmin, isAdmin, async (request, response) => {
  const supermarket = request.params.supermarket
  const search = await PromotionController.all(supermarket)
  response.json(search)
})
routesPromotionWeb.get('/detail/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await PromotionController.detail({ _id })
  response.json(detail)
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
  const search = await PromotionController.all(supermarket)
  response.json(search)
})

module.exports = { routesPromotionApp, routesPromotionWeb }
