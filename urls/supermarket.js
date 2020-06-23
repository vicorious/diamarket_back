'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesSupermarketWeb = asyncify(express.Router())
const routesSupermarketApp = asyncify(express.Router())
const supermarketController = require('../controllers/supermarketController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesSupermarketWeb.get('/createpos', async (request, response) => {
  const supermarkets = await supermarketController.createDataPos()
  response.json(supermarkets)
})
/**
 * @swagger
 * /web/supermarket:
 *  post:
 *    tags:
 *      - Supermarket
 *    description: En este endpoint un superadministrador puede registrar un supermercado
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
 *        $ref: '#/definitions/Supermarket'
 *    responses:
 *      200:
 *        description: responde el siguiente objeto
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
 *                  example: id de mongo
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
 *              example: "Ya se encuentra registrado un supermercado con esa dirección"
 */
routesSupermarketWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await supermarketController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /web/supermarket/{id}:
 *  put:
 *    tags:
 *      - Supermarket
 *    description: En este endpoint un superadministrador puede registrar un supermercado
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
 *      example: id del supermercado
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/Supermarket'
 *    responses:
 *      200:
 *        description: responde el siguiente objeto
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
 *              example: []
 *            mensaje:
 *              type: string
 *              example: "Datos no actualizados"
 */
routesSupermarketWeb.put('/:id', convertBase64ToFile, isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await supermarketController.update({ _id }, data)
  response.json(update)
})

/**
 * @swagger
 * /web/supermarket:
 *  get:
 *    tags:
 *      - Supermarket
 *    description: Este endpoint lista los supermercados
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
 *              type: array
 *              items:
 *                $ref: '#/definitions/Supermarket'
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
routesSupermarketWeb.get('', isSuperAdmin, async (request, response) => {
  const all = await supermarketController.all()
  response.json(all)
})

/**
 * @swagger
 * /web/supermarket/detail/{id}:
 *  get:
 *    tags:
 *      - Supermarket
 *    description: Este endpoint se detalla un supermercado
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
 *      example: id del supermercado
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
 *              $ref: '#/definitions/Supermarket'
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
 *              example: []
 *            mensaje:
 *              type: string
 *              example: "No se ha encontrado el supermercado "
 */
routesSupermarketWeb.get('/detail/:id', async (request, response) => {
  const _id = request.params.id
  const detail = await supermarketController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /web/supermarket/withoutadmin:
 *  get:
 *    tags:
 *      - Supermarket
 *    description: Este endpoint lista los supermercados sin administrador
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
 *              type: array
 *              items:
 *                $ref: '#/definitions/Supermarket'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no hay supermercados
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
 *              example: "No se ha encontrado supermercados"
 */
routesSupermarketWeb.get('/withoutadmin', async (request, response) => {
  const supermarkets = await supermarketController.marketWithOutAdministrator()
  response.json(supermarkets)
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
  const rate = await supermarketController.rateSupermarket({ _id }, data,request.io.io)
  response.json(rate)
})

/**
 * @swagger
 * /app/supermarket?lat=4.624675&lng=-74.0734763:
 *   get:
 *     tags:
 *       - Supermarket
 *     description: Este endpoint lista los supermercados que estan cerca al usuario
 *     produces:
 *     - applications/json
 *     parameters:
 *     - in: header
 *       name: Authorization
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description:  Se listan todos los supermercados
 *         schema:
 *           properties:
 *             estado:
 *               type: boolean
 *               example: true
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: "#/definitions/Supermarket"
 *             mensaje:
 *               type: string
 *               example: null
 *       400:
 *         description: No existen supermercados creados
 *         schema:
 *           properties:
 *             estado:
 *               type: boolean
 *               exmaple: false
 *             data:
 *               type: array
 *               items:
 *                 example: "Array vacio"
 *             mensaje:
 *               type: string
 *               example: "No existen supermercados"
 */

routesSupermarketApp.get('', async (request, response) => {
  const data = request.query
  const all = await supermarketController.searchSuperMarketForGeoLocation(data)
  response.json(all)
})

module.exports = { routesSupermarketApp, routesSupermarketWeb }
