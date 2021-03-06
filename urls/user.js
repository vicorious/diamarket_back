'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin, isSuperAdminAndIsAdminAndIsDomiciliary } = require('../middleware/token')
const routesUserApp = asyncify(express.Router())
const routesUserWeb = asyncify(express.Router())
const SuperMarketSchema = require('../models/supermarketSchema')
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
  delete data._id
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
 * /web/user/usertype/{usertype}/{quantity}/{page}:
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
 *    - in: header
 *      name: quantity
 *      required: true
 *    - in: header
 *      name: page
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
routesUserWeb.get('/usertype/:usertype/:quantity/:page', isSuperAdminAndIsAdminAndIsDomiciliary, async (request, response) => {
  const rol = request.params.usertype
  const quantity = request.params.quantity
  const page = request.params.page
  if (request.User.rol === 'superadministrator') {
    const data = await UserController.allPage({ rol }, quantity, page)
    response.json(data)
  } else {
    if(rol === 'client') {
      const admin = await UserController.detail({ _id: request.User.id })
      const supermarket = await SuperMarketSchema.get({ idAdmin: admin.data._id })
      console.log("supermarket", supermarket)
      const data = await UserController.allPage({ rol: 'client', supermarketFavorite: supermarket._id }, quantity, page)
      console.log("data",data)
      response.json(data)  
    } else if (rol === 'domiciliary'){
      const admin = await UserController.detail({ _id: request.User.id })
      console.log(admin)
      const supermarket = await SuperMarketSchema.get({ idAdmin: admin.data._id })
      console.log(supermarket)
      const data = await UserController.allPage({ rol: 'domiciliary', workingSupermarket: supermarket._id }, quantity, page)
      response.json(data)  
    }
  }
  
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
  console.log(data)
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
  console.log("data", data)
  const update = await UserController.updateApp({ _id }, data)
  console.log(update)
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
/**
 * @swagger
 * /app/user/createcard:
 *  post:
 *    tags:
 *      - User
 *    description: En este endpoint se registra una tarjeta
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
 *          type:
 *            type: string
 *            example: VISA
 *          number:
 *            type: number
 *            example: 31231231231
 *          securityCode:
 *            type: number
 *            example: 213
 *          expirationDate:
 *            type: string
 *            example: 2023/01 primero el año luego el mes
 *          name:
 *            type: string
 *            example: Nicolas
 *          identification:
 *            type: number
 *            example: 12312312312
 *    responses:
 *      200:
 *        description: Si la tarjeta no se encuentra registrada se devuelve el siguinete objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: boolean
 *              example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la tarjeta ya se encuentra registrada se devuelve el siguiente error
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
 *              example: La tarketa ya se encuentra registrada
 */
routesUserApp.post('/createcard', isClient,async (request, response) => {
  let data = request.body
  data._id = request.User.id
  const create = await UserController.createCard(data)
  response.json(create)
})

/**
 * @swagger
 * /app/user/cards:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se listan las tarjetas de un usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: Listado de tarjetas agregadas al cliente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                properties:
 *                  uid:
 *                    type: string
 *                    example: 2312312sdadsf1231
 *                  number:
 *                    type: string
 *                    example: 543123******1234
 *                  name:
 *                    type: string
 *                    example: Nicolas Salazar
 *                  type:
 *                    type: string
 *                    example: MASTERCARD
 *      400:
 *        description: Si no tiene tarjetas guardadas
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: array vacio
 *            mensaje:
 *              type: string
 *              example: No tiene tarjetas registradas
 */
routesUserApp.get('/cards', isClient, async (request, response) => {
  const _id = request.User.id
  const cards = await UserController.listCards({ _id })
  response.json(cards)
})

/**
 * @swagger
 * /app/user/detailcard/{uid}:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se detalla una tarjeta
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: path
 *      name: uid
 *      required: true
 *    responses:
 *      200:
 *        description: objeto de la tarjeta
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                uid:
 *                  type: string
 *                  example: 123123123dfaf121
 *                number:
 *                  type: string
 *                  example: 543123******1234
 *                name:
 *                  type: string
 *                  example: NICOLAS SALAZAR
 *                type:
 *                  type: string
 *                  example: MASTERCARD
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la tarjeta seleccionada no existe
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: array vacio
 *            mensaje:
 *              type: string
 *              example: Esta tarjeta no se encuentra
 */
routesUserApp.get('/detailcard/:uid', isClient, async (request, response) => {
  const _id = request.User.id
  const uid = request.params.uid
  const card = await UserController.detailCard(_id, uid)
  response.json(card)
})

/**
 * @swagger
 * /app/user/deletecard/{uid}:
 *  delete:
 *    tags:
 *      - User
 *    description: En este endpoint se detalla una tarjeta
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: path
 *      name: uid
 *      required: true
 *    responses:
 *      200:
 *        description: Si la tarjeta se elimina exitosamente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: boolean
 *              example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la tarjeta seleccionada no existe
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: array vacio
 *            mensaje:
 *              type: string
 *              example: Esta tarjeta no se encuentra
 */
routesUserApp.delete('/deletecard/:uid', isClient, async (request, response) => {
  const _id = request.User.id
  const uid = request.params.uid
  const card = await UserController.deleteCard(_id, uid)
  response.json(card)
})

/**
 * @swagger
 * /app/user/updatetoken:
 *  put:
 *    tags:
 *      - User
 *    description: En este endpoint se actualiza el token de firebase messaging
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
 *          tokenCloudingMessagin:
 *            type: string
 *            example: token de firebase
 *    responses:
 *      200:
 *        description: Si el token se actualiza correctamente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: boolean
 *              example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no existe
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
 *              example: El usuario no existe
 */
routesUserApp.put('/updatetoken', isClient, async (request, response) => {
  const data = request.body
  const _id = request.User.id
  const update = await UserController.updateToken({_id},{ tokenCloudingMessagin: data.tokenCloudingMessagin  })
  response.json(update)
})
/**
 * @swagger
 * /app/user/card/default:
 *  put:
 *    tags:
 *      - User
 *    description: En este endpoint se actualiza la tarjeta por defecto
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
 *          cardId:
 *            type: string
 *            example: id card
 *    responses:
 *      200:
 *        description: Si la tarjeta se actualiza correctamente
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: boolean
 *              example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si ocurre un error
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
 *              example: Ocurrio un error
 */
routesUserApp.put('/card/default',isClient, async (request, response) => {
  const _id = request.User.id
  const data = request.body
  const update = await UserController.updateDefaultCard({ _id }, data)
  response.json(update)
})

/**
 * @swagger
 * /app/user/card/default:
 *  get:
 *    tags:
 *      - User
 *    description: En este endpoint se obtiene la tarjeta por defecto
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
 *          userId:
 *            type: string
 *            example: id
 *    responses:
 *      200:
 *        description: Si la tarjeta se encuentra retorna los datos de ella
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: boolean
 *              example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si ocurre un error
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
 *              example: Ocurrio un error
 */
routesUserApp.get('/card/default',isClient, async (request, response) => {
  const _id = request.User.id
  const update = await UserController.listCardDefault({ _id })
  response.json(update)
})

/**
 * @swagger
 * /app/user/address/{uid}):
 *  delete:
 *    tags:
 *      - User
 *    description: En este endpoint se elimina una direccion
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    - in: path
 *      name: id
 *      required: true
 *    responses:
 *      200:
 *        description: Si la eliminacion de la data fue exitosa se responde con el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                deleted:
 *                  type: boolean
 *                  example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si la lista no existe
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
 *              example: 'No existe la direccion de usuario'
 */
routesUserApp.delete('/address/:uid', isClient, async (request, response) => {
  const uid = request.params.uid
  const _id = request.User.id
  const user = await UserController.deleteForId(uid,_id)
  response.json(user)
})
module.exports = { routesUserApp, routesUserWeb }
