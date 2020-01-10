'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const { isSuperAdmin, isAdmin, isDomiciliary, isClient } = require('../middleware/token')
const routesUserApp = asyncify(express.Router())
const routesUserWeb = asyncify(express.Router())
const { convertBase64ToFile } = require('../middleware/convertBase64File')

routesUserWeb.post('', isSuperAdmin, isAdmin, async (request, response) => {
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

routesUserWeb.put('', convertBase64ToFile, isSuperAdmin, isAdmin, isDomiciliary, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const update = await UserController.update({ _id }, data)
  response.json(update)
})

routesUserWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = await UserController.detail({ _id })
  response.json(data)
})

routesUserWeb.get('/detail', isSuperAdmin, isAdmin, isDomiciliary, async (request, response) => {
  const _id = request.User.id
  const detail = await UserController.detail({ _id })
  response.json(detail)
})

routesUserWeb.get('/clients', isSuperAdmin, async (request, response) => {
  const data = await UserController.all({ rol: 'client' })
  response.json(data)
})

routesUserWeb.get('/all/domiciliary', isSuperAdmin, async (request, response) => {
  const data = await UserController.all({ rol: 'domiciliary' })
  response.json(data)
})

routesUserWeb.get('/supermarketclients/:id', isAdmin, async (request, response) => {
  const _id = request.params.id
  const data = await UserController.clientSupermarket(_id)
  response.json(data)
})

/**
 * @swagger
 * /app/user:
 *  post:
 *    tags:
 *      - User
 *    description: Este endpoint crea un usuario cliente
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: Si el usuario se crea correctamente
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
 *        description: El usuario ya se encuentra registrado
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
 *              example: 'El usuario ya se encuentra registrado en el sistema'
 */

routesUserApp.post('', async (request, response) => {
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /app/user/direction:
 *  post:
 *    tags:
 *      - User
 *    description: Este endpoint crea las direcciones del cliente
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        properties:
 *          name:
 *            type: string
 *          address:
 *            type: string
 *          location:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                example: Point
 *              coordinates:
 *                type: array
 *                items:
 *                  example: 'Lat, long'
 *    responses:
 *      200:
 *        description: Si la direccion se crea correctamente se responde el siguiente objeto
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
 *        description: Si el usuario no existe se responde el siguiente objeto
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
 *              example: 'El usuario no existe'
 */
routesUserApp.post('/direction', isClient, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const createDirection = await UserController.createDirection({ _id }, data)
  response.json(createDirection)
})

/**
 * @swagger
 * /app/user:
 *  put:
 *    tags:
 *      - User
 *    description: En este endpoint se actualiza la informacion de un usuario, se puede enviar cualquier dato del usuario este endpoint lo actualizara
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: Si el usuario existe devuelve el siguiente objeto
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
 *        description: Si el usuario no existe se responde el siguiente objeto
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
 *              example: 'El usuario no ha sido actualizado'
 */
routesUserApp.put('', convertBase64ToFile, isClient, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const update = await UserController.update({ _id }, data)
  response.json(update)
})

/**
 * @swagger
 * /app/user/validate:
 *  put:
 *    tags:
 *      - User
 *    description: En este endpoint sse valida el codigo para activar el usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        properties:
 *          email:
 *            type: string
 *          code:
 *            type: string
 *    responses:
 *      200:
 *        description: Si se encuentra el usuario se activa de una vez y se devuelve el token
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                user:
 *                  $ref: '#/definitions/User'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no existe devuelve el siguiente objeto
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
 *              example: 'El código de autencticación no es valido'
 */
routesUserApp.put('/validate', async (request, response) => {
  const data = request.body
  const validate = await UserController.validate(data)
  response.json(validate)
})

/**
 * @swagger
 * /app/user/sendcode:
 *  post:
 *    tags:
 *      - User
 *    description: En este endpoint se envia el codigo para restaurar la contraseña
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        properties:
 *          email:
 *            type: string
 *          code:
 *            type: string
 *    responses:
 *      200:
 *        description: Si se encuentra el usuario se activa de una vez y se devuelve el token
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                user:
 *                  $ref: '#/definitions/User'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no existe devuelve el siguiente objeto
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
 *              example: 'El código de autencticación no es valido'
 */
routesUserApp.post('/sendcode', async (request, response) => {
  const data = request.body
  const update = await UserController.sendCode(data)
  response.json(update)
})

/**
 * @swagger
 * /app/user/changepassword:
 *  post:
 *    tags:
 *      - User
 *    description: En este endpoint se cambia la contraseña
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        properties:
 *          code:
 *            type: string
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: Si se encuentra el usuario se cambia la contraseña
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
 *        description: Si el usuario no existe devuelve el siguiente objeto
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
 *              example: 'El código  no coincide'
 */
routesUserApp.post('/changepassword', async (request, response) => {
  const data = request.body
  const user = await UserController.updatePassword(data)
  response.json(user)
})

/**
 * @swagger
 * /app/user/detail:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se cambia la contraseña
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: Si se encuentra el usuario se devuelve el objeto del usuario
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/User'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no existe devuelve el siguiente objeto
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
 *              example: 'El usuario no se encuentra registrado'
 */
routesUserApp.get('/detail', isClient, async (request, response) => {
  const _id = request.User.id
  const user = await UserController.detail({ _id })
  response.json(user)
})

module.exports = { routesUserApp, routesUserWeb }
