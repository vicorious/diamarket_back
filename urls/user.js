'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin, isSuperAdminAndIsAdminAndIsDomiciliary } = require('../middleware/token')
const routesUserApp = asyncify(express.Router())
const routesUserWeb = asyncify(express.Router())
const { convertBase64ToFile } = require('../middleware/convertBase64File')

/**
 * @swagger
 * /web/user/superadministrator:
 *  post:
 *    tags:
 *      - User
 *    description: Este endpoint crea un usuario super administrador, solamente lo pueden crear los superadministradores del proyecto
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
 *          identification:
 *            type: string
 *          email:
 *            type: string
 *          cellPhone:
 *            type: string
 *          password:
 *            type: string
 *          supermarket:
 *            type: string
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

routesUserWeb.post('/superadministrator', isSuperAdmin, convertBase64ToFile, async (request, response) => {
  request.body.rol = 'superadministrator'
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /web/user/administrator:
 *  post:
 *    tags:
 *      - User
 *    description: Este endpoint crea un usuario administrador, solamente tiene permisos los super administradores del proyecto
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
 *          identification:
 *            type: string
 *          email:
 *            type: string
 *          cellPhone:
 *            type: string
 *          password:
 *            type: string
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

routesUserWeb.post('/administrator', isSuperAdmin, convertBase64ToFile, async (request, response) => {
  request.body.rol = 'administrator'
  const data = request.body
  const create = await UserController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /web/user/domiciliary:
 *  post:
 *    tags:
 *      - User
 *    description: Este endpoint crea un usuario domiciliary, solamente tiene permisos los super administradores y los administradores del proyecto
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
 *          identification:
 *            type: string
 *          email:
 *            type: string
 *          cellPhone:
 *            type: string
 *          password:
 *            type: string
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

routesUserWeb.post('/domiciliary', isAdminAndIsSuperAdmin, convertBase64ToFile, async (request, response) => {
  if (request.User.rol === 'superadministrator') {
    request.body.rol = 'domiciliary'
    const data = request.body
    const create = await UserController.create(data)
    response.json(create)
  } else {
    request.body.rol = 'domiciliary'
    request.body.idAdmin = request.User.id
    const data = request.body
    const create = await UserController.create(data)
    response.json(create)
  }
})

/**
 * @swagger
 * /web/user/detail/{id}:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se detalla al usuario por el id enviado en cabecera
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
routesUserWeb.get('/detail/:id', async (request, response) => {
  const _id = request.params.id
  const data = await UserController.detail({ _id })
  console.log(data)
  response.json(data)
})

/**
 * @swagger
 * /web/user/detail:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se detalla el usuario en sesion
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: si se encuentra el usuario se devuelve toda la informacion
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
routesUserWeb.get('/detail', isSuperAdminAndIsAdminAndIsDomiciliary, async (request, response) => {
  const _id = request.User.id
  const detail = await UserController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /web/user/usertype/{usertype}:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se traen todos los usuarios por rol
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: header
 *      name: usertype
 *      required: true
 *    responses:
 *      200:
 *        description: si se encuentra los usuarios se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/User'
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
routesUserWeb.get('/usertype/:usertype/:quantity/:page', async (request, response) => {
  const rol = request.params.usertype
  const quantity = request.params.quantity
  const page = request.params.page
  const data = await UserController.allPage({ rol }, quantity, page)
  response.json(data)
})

/**
 * @swagger
 * /web/user/administrators:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se traen todos los usuarios administradores que no tienen ningun supermercado asignado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: si se encuentra los usuarios se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/User'
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
 *              example: 'No hay administradores disponibles para asignar'
 */
routesUserWeb.get('/administrators', isSuperAdmin, async (request, response) => {
  const administrators = await UserController.administratorsWithoutSupermarket()
  response.json(administrators)
})

/**
 * @swagger
 * /web/user/clientsforsupermarket:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se traen todos los clientes de un supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: si se encuentra los usuarios se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/User'
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
 *              example: 'No hay clientes para este supermercado'
 */
routesUserWeb.get('/clientsforsupermarket', isAdmin, async (request, response) => {
  const _id = request.User.id
  const users = await UserController.clientsForSuperMarket({ _id })
  response.json(users)
})

/**
 * @swagger
 * /web/user/domiciliaryforsupermarket:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se traen todos los domiciliarios de un supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: si se encuentra los usuarios se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/User'
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
 *              example: 'Este supermercado no tiene domiciliarios'
 */
routesUserWeb.get('/domiciliaryforsupermarket', isAdmin, async (request, response) => {
  const _id = request.User.id
  const users = await UserController.domiciliaryForSuperMarket(_id)
  response.json(users)
})

/**
 * @swagger
 * /web/user/{id}:
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
 *    - in: path
 *      name: id
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
routesUserWeb.put('/:id', convertBase64ToFile, isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await UserController.update({ _id }, data)
  response.json(update)
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
 *          cellPhone:
 *            type: string
 *    responses:
 *      200:
 *        description: Si se encuentra el usuario se envia el codigo de verificacion para el cambio de contraseña
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: El sms fue enviado
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
 *              example: 'El usuario no existe'
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
 *    description: En este endpoint se detalla un usuario
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
