'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesSupermarketWeb = asyncify(express.Router())
const routesSupermarketApp = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesSupermarketWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await supermarketController.create(data)
  response.json(create)
})

routesSupermarketWeb.put('/:id', convertBase64ToFile, isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await supermarketController.update({ _id }, data)
  response.json(update)
})

routesSupermarketWeb.get('', isSuperAdmin, async (request, response) => {
  const all = await supermarketController.all()
  response.json(all)
})

routesSupermarketWeb.get('/detail/:id', isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await supermarketController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /app/supermarket/rate/{id}:
 *  put:
 *    tags:
 *      - Supermarket
 *    description: En este endpoint se califica el supermercado
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
 *        description: Si se actualiza correctamente la calificacion se devuelve el siguiente objeto
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
routesSupermarketApp.put('/rate/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const rate = await supermarketController.rateSupermarket({ _id }, data)
  response.json(rate)
})

module.exports = { routesSupermarketApp, routesSupermarketWeb }
