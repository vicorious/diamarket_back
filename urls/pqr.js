'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const PqrController = require('../controllers/pqrController')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const routesPqrWeb = asyncify(express.Router())
const routesPqrApp = asyncify(express.Router())

routesPqrWeb.post('', isAdmin, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await PqrController.create(data)
  response.json(create)
})

routesPqrWeb.get('', isSuperAdmin, async (request, response) => {
  const all = await PqrController.getAll()
  response.json(all)
})

routesPqrWeb.get('/detail/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await PqrController.getFirst({ _id })
  response.json(detail)
})

routesPqrWeb.put('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await PqrController.update({ _id }, data)
  response.json(update)
})

routesPqrWeb.get('/bysupermarket', isAdmin, async (request, response) => {
  const _id = request.User.id
  const pqrs = await PqrController.bySupermarket({ _id })
  response.json(pqrs)
})

/**
 * @swagger
 * /app/pqr/supermarket:
 *  post:
 *    tags:
 *      - Pqr
 *    description: En este endpoint se genera un pqr para el supermercado
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
 *          description:
 *            type: string
 *          supermarket:
 *            type: string
 *            example: El id del supermercado
 *    responses:
 *      200:
 *        description: Se crea la pqr
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
 */
routesPqrApp.post('/supermarket', isClient, async (request, response) => {
  request.body.client = request.User.id
  const data = request.body
  const create = await PqrController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /app/pqr/superadmin:
 *  post:
 *    tags:
 *      - Pqr
 *    description: En este endpoint se crea una pqr para el super administradorr
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
 *          description:
 *            type: string
 *    responses:
 *      200:
 *        description: Se crea la pqr
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
 */
routesPqrApp.post('/superadmin', isClient, async (request, response) => {
  request.body.client = request.User.id
  const data = request.body
  const create = await PqrController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /app/pqr/detail/{id}:
 *  get:
 *    tags:
 *      - Pqr
 *    description: En este endpoint se detalla una pqr
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
 *        description: Se detalla la pqr
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref : '#/definitions/Pqr'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no existe se devuelve el siguiente objeto
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
 *              example: No existe la pqr
 */
routesPqrApp.get('/detail/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await PqrController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /app/pqr:
 *  get:
 *    tags:
 *      - Pqr
 *    description: En este endpoint se traen todas las pqr por el usuario en sesion
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Se listan las pqr por el usuario
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref : '#/definitions/Pqr'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no existe se devuelve el siguiente objeto
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
 *              example: No existen pqrs para este usuario
 */
routesPqrApp.get('', isClient, async (request, response) => {
  const id = request.User.id
  const all = await PqrController.allForUser(id)
  response.json(all)
})

module.exports = { routesPqrApp, routesPqrWeb }
