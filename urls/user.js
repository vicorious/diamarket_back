'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const UserController = require('../controllers/userController')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin, isSuperAdminAndIsAdminAndIsDomiciliary } = require('../middleware/token')
const routesUserApp = asyncify(express.Router())
const routesUserWeb = asyncify(express.Router())
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const xml2Json = require('xml2json')
const formatedXML = require('xml-formatter')

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
routesUserWeb.get('/usertype/:usertype', async (request, response) => {
  const rol = request.params.usertype
  const data = await UserController.all({ rol })
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

routesUserApp.get('/prueba', async (request, response) => {
  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>
  <SOAP-ENV:Envelope
          SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="urn:especificas_base"><SOAP-ENV:Body>
  <ns1:getPaisesPolizaResponse xmlns:ns1="urn:especificas_base"><cod_respon xsi:type="xsd:string">1000
  </cod_respon><msg_respon xsi:type="xsd:string">Lista de paises OK </msg_respon><dat_paises
  xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:InfoPaises[247]"><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">22</cod_paises><nom_paisxx xsi:type="xsd:string">Afganistan</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">23</cod_paises><nom_paisxx
  xsi:type="xsd:string">�land</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">24</cod_paises><nom_paisxx xsi:type="xsd:string">Albania</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">5</cod_paises><nom_paisxx
  xsi:type="xsd:string">Alemania</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">25</cod_paises><nom_paisxx xsi:type="xsd:string">Andorra</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">26</cod_paises><nom_paisxx
  xsi:type="xsd:string">Angola</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">27</cod_paises><nom_paisxx xsi:type="xsd:string">Anguila</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">28</cod_paises><nom_paisxx
  xsi:type="xsd:string">Antigua y Barbuda</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">29</cod_paises><nom_paisxx
  xsi:type="xsd:string">Antillas Neerlandesas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">30</cod_paises><nom_paisxx xsi:type="xsd:string">Arabia Saudita</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">31</cod_paises><nom_paisxx
  xsi:type="xsd:string">Argelia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">8</cod_paises><nom_paisxx xsi:type="xsd:string">Argentina</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">32</cod_paises><nom_paisxx
  xsi:type="xsd:string">Armenia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">33</cod_paises><nom_paisxx xsi:type="xsd:string">Aruba</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">34</cod_paises><nom_paisxx
  xsi:type="xsd:string">Australia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">35</cod_paises><nom_paisxx xsi:type="xsd:string">Austria</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">178</cod_paises><nom_paisxx
  xsi:type="xsd:string">Autoridad Nacional Palestina</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">36</cod_paises><nom_paisxx xsi:type="xsd:string">Azerbaiy�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">37</cod_paises><nom_paisxx
  xsi:type="xsd:string">Bahamas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">39</cod_paises><nom_paisxx xsi:type="xsd:string">Banglad�s</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">40</cod_paises><nom_paisxx
  xsi:type="xsd:string">Barbados</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">38</cod_paises><nom_paisxx xsi:type="xsd:string">Bar�in</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">41</cod_paises><nom_paisxx
  xsi:type="xsd:string">B�lgica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">42</cod_paises><nom_paisxx xsi:type="xsd:string">Belice</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">43</cod_paises><nom_paisxx
  xsi:type="xsd:string">Ben�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">44</cod_paises><nom_paisxx xsi:type="xsd:string">Bermudas</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">45</cod_paises><nom_paisxx
  xsi:type="xsd:string">Bielorrusia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">46</cod_paises><nom_paisxx xsi:type="xsd:string">Birmania</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">47</cod_paises><nom_paisxx
  xsi:type="xsd:string">Bolivia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">48</cod_paises><nom_paisxx xsi:type="xsd:string">Bosnia y Herzegovina</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">49</cod_paises><nom_paisxx
  xsi:type="xsd:string">Botsuana</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">10</cod_paises><nom_paisxx xsi:type="xsd:string">Brasil</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">51</cod_paises><nom_paisxx
  xsi:type="xsd:string">Brun�i</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">52</cod_paises><nom_paisxx xsi:type="xsd:string">Bulgaria</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">53</cod_paises><nom_paisxx
  xsi:type="xsd:string">Burkina Faso</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">54</cod_paises><nom_paisxx xsi:type="xsd:string">Burundi</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">55</cod_paises><nom_paisxx
  xsi:type="xsd:string">But�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">56</cod_paises><nom_paisxx xsi:type="xsd:string">Cabo Verde</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">58</cod_paises><nom_paisxx
  xsi:type="xsd:string">Camboya</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">59</cod_paises><nom_paisxx xsi:type="xsd:string">Camer�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">20</cod_paises><nom_paisxx
  xsi:type="xsd:string">Canada</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">185</cod_paises><nom_paisxx xsi:type="xsd:string">Catar</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">61</cod_paises><nom_paisxx
  xsi:type="xsd:string">Chad</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">11</cod_paises><nom_paisxx xsi:type="xsd:string">Chile</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">63</cod_paises><nom_paisxx
  xsi:type="xsd:string">China</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">64</cod_paises><nom_paisxx xsi:type="xsd:string">Chipre</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">239</cod_paises><nom_paisxx
  xsi:type="xsd:string">Ciudad del Vaticano</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">3</cod_paises><nom_paisxx xsi:type="xsd:string">Colombia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">66</cod_paises><nom_paisxx
  xsi:type="xsd:string">Comoras</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">70</cod_paises><nom_paisxx xsi:type="xsd:string">Corea del Norte</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">71</cod_paises><nom_paisxx
  xsi:type="xsd:string">Corea del Sur</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">72</cod_paises><nom_paisxx xsi:type="xsd:string">Costa de Marfil</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">73</cod_paises><nom_paisxx
  xsi:type="xsd:string">Costa Rica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">74</cod_paises><nom_paisxx xsi:type="xsd:string">Croacia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">75</cod_paises><nom_paisxx
  xsi:type="xsd:string">Cuba</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">76</cod_paises><nom_paisxx xsi:type="xsd:string">Dinamarca</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">77</cod_paises><nom_paisxx
  xsi:type="xsd:string">Dominica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">2</cod_paises><nom_paisxx xsi:type="xsd:string">Ecuador</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">79</cod_paises><nom_paisxx
  xsi:type="xsd:string">Ecuador</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">80</cod_paises><nom_paisxx xsi:type="xsd:string">Egipto</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">81</cod_paises><nom_paisxx
  xsi:type="xsd:string">El Salvador</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">82</cod_paises><nom_paisxx
  xsi:type="xsd:string">Emiratos �rabes Unidos</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">83</cod_paises><nom_paisxx xsi:type="xsd:string">Eritrea</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">84</cod_paises><nom_paisxx
  xsi:type="xsd:string">Eslovaquia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">85</cod_paises><nom_paisxx xsi:type="xsd:string">Eslovenia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">15</cod_paises><nom_paisxx
  xsi:type="xsd:string">Espa�a</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">14</cod_paises><nom_paisxx xsi:type="xsd:string">Estados Unidos</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">86</cod_paises><nom_paisxx
  xsi:type="xsd:string">Estonia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">87</cod_paises><nom_paisxx xsi:type="xsd:string">Etiop�a</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">89</cod_paises><nom_paisxx
  xsi:type="xsd:string">Filipinas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">90</cod_paises><nom_paisxx xsi:type="xsd:string">Finlandia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">91</cod_paises><nom_paisxx
  xsi:type="xsd:string">Fiyi</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">6</cod_paises><nom_paisxx xsi:type="xsd:string">Francia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">92</cod_paises><nom_paisxx
  xsi:type="xsd:string">Gab�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">93</cod_paises><nom_paisxx xsi:type="xsd:string">Gambia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">94</cod_paises><nom_paisxx
  xsi:type="xsd:string">Georgia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">96</cod_paises><nom_paisxx xsi:type="xsd:string">Ghana</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">97</cod_paises><nom_paisxx
  xsi:type="xsd:string">Gibraltar</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">98</cod_paises><nom_paisxx xsi:type="xsd:string">Granada</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">99</cod_paises><nom_paisxx
  xsi:type="xsd:string">Grecia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">100</cod_paises><nom_paisxx xsi:type="xsd:string">Groenlandia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">101</cod_paises><nom_paisxx
  xsi:type="xsd:string">Guadalupe</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">102</cod_paises><nom_paisxx xsi:type="xsd:string">Guam</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">103</cod_paises><nom_paisxx
  xsi:type="xsd:string">Guatemala</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">104</cod_paises><nom_paisxx xsi:type="xsd:string">Guayana Francesa</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">105</cod_paises><nom_paisxx
  xsi:type="xsd:string">Guernsey</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">106</cod_paises><nom_paisxx xsi:type="xsd:string">Guinea</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">107</cod_paises><nom_paisxx
  xsi:type="xsd:string">Guinea Ecuatorial</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">108</cod_paises><nom_paisxx xsi:type="xsd:string">Guinea-Bissau</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">109</cod_paises><nom_paisxx
  xsi:type="xsd:string">Guyana</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">110</cod_paises><nom_paisxx xsi:type="xsd:string">Hait�</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">21</cod_paises><nom_paisxx
  xsi:type="xsd:string">Holanda</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">112</cod_paises><nom_paisxx xsi:type="xsd:string">Honduras</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">113</cod_paises><nom_paisxx
  xsi:type="xsd:string">Hong Kong</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">114</cod_paises><nom_paisxx xsi:type="xsd:string">Hungr�a</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">115</cod_paises><nom_paisxx
  xsi:type="xsd:string">India</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">116</cod_paises><nom_paisxx xsi:type="xsd:string">Indonesia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">118</cod_paises><nom_paisxx
  xsi:type="xsd:string">Irak</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">117</cod_paises><nom_paisxx xsi:type="xsd:string">Ir�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">18</cod_paises><nom_paisxx
  xsi:type="xsd:string">Irlanda</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">50</cod_paises><nom_paisxx xsi:type="xsd:string">Isla Bouvet</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">148</cod_paises><nom_paisxx
  xsi:type="xsd:string">Isla de Man</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">165</cod_paises><nom_paisxx xsi:type="xsd:string">Isla de Navidad</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">119</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islandia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">57</cod_paises><nom_paisxx xsi:type="xsd:string">Islas Caim�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">65</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Cocos</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">69</cod_paises><nom_paisxx xsi:type="xsd:string">Islas Cook</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">88</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Feroe</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">95</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Georgias del Sur y Sandwich del Sur</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">111</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Heard y McDonald</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">147</cod_paises><nom_paisxx xsi:type="xsd:string">Islas Malvinas</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">149</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Marianas del Norte</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">151</cod_paises><nom_paisxx xsi:type="xsd:string">Islas Marshall</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">180</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Pitcairn</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">192</cod_paises><nom_paisxx xsi:type="xsd:string">Islas Salom�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">231</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas Turcas y Caicos</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">241</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas V�rgenes Brit�nicas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">242</cod_paises><nom_paisxx
  xsi:type="xsd:string">Islas V�rgenes de los Estados Unidos</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">120</cod_paises><nom_paisxx
  xsi:type="xsd:string">Israel</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">16</cod_paises><nom_paisxx xsi:type="xsd:string">Italia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">121</cod_paises><nom_paisxx
  xsi:type="xsd:string">Jamaica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">122</cod_paises><nom_paisxx xsi:type="xsd:string">Jap�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">123</cod_paises><nom_paisxx
  xsi:type="xsd:string">Jersey</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">124</cod_paises><nom_paisxx xsi:type="xsd:string">Jordania</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">125</cod_paises><nom_paisxx
  xsi:type="xsd:string">Kazajist�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">126</cod_paises><nom_paisxx xsi:type="xsd:string">Kenia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">127</cod_paises><nom_paisxx
  xsi:type="xsd:string">Kirguist�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">128</cod_paises><nom_paisxx xsi:type="xsd:string">Kiribati</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">129</cod_paises><nom_paisxx
  xsi:type="xsd:string">Kuwait</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">130</cod_paises><nom_paisxx xsi:type="xsd:string">Laos</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">131</cod_paises><nom_paisxx
  xsi:type="xsd:string">Lesoto</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">132</cod_paises><nom_paisxx xsi:type="xsd:string">Letonia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">133</cod_paises><nom_paisxx
  xsi:type="xsd:string">L�bano</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">134</cod_paises><nom_paisxx xsi:type="xsd:string">Liberia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">135</cod_paises><nom_paisxx
  xsi:type="xsd:string">Libia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">136</cod_paises><nom_paisxx xsi:type="xsd:string">Liechtenstein</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">137</cod_paises><nom_paisxx
  xsi:type="xsd:string">Lituania</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">138</cod_paises><nom_paisxx xsi:type="xsd:string">Luxemburgo</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">139</cod_paises><nom_paisxx
  xsi:type="xsd:string">Macao</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">141</cod_paises><nom_paisxx xsi:type="xsd:string">Madagascar</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">142</cod_paises><nom_paisxx
  xsi:type="xsd:string">Malasia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">143</cod_paises><nom_paisxx xsi:type="xsd:string">Malaui</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">144</cod_paises><nom_paisxx
  xsi:type="xsd:string">Maldivas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">145</cod_paises><nom_paisxx xsi:type="xsd:string">Mal�</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">146</cod_paises><nom_paisxx
  xsi:type="xsd:string">Malta</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">150</cod_paises><nom_paisxx xsi:type="xsd:string">Marruecos</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">152</cod_paises><nom_paisxx
  xsi:type="xsd:string">Martinica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">153</cod_paises><nom_paisxx xsi:type="xsd:string">Mauricio</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">154</cod_paises><nom_paisxx
  xsi:type="xsd:string">Mauritania</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">155</cod_paises><nom_paisxx xsi:type="xsd:string">Mayotte</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">17</cod_paises><nom_paisxx
  xsi:type="xsd:string">Mexico</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">156</cod_paises><nom_paisxx xsi:type="xsd:string">Micronesia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">157</cod_paises><nom_paisxx
  xsi:type="xsd:string">Moldavia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">158</cod_paises><nom_paisxx xsi:type="xsd:string">M�naco</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">159</cod_paises><nom_paisxx
  xsi:type="xsd:string">Mongolia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">160</cod_paises><nom_paisxx xsi:type="xsd:string">Montenegro</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">161</cod_paises><nom_paisxx
  xsi:type="xsd:string">Montserrat</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">162</cod_paises><nom_paisxx xsi:type="xsd:string">Mozambique</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">163</cod_paises><nom_paisxx
  xsi:type="xsd:string">Namibia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">164</cod_paises><nom_paisxx xsi:type="xsd:string">Nauru</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">166</cod_paises><nom_paisxx
  xsi:type="xsd:string">Nepal</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">167</cod_paises><nom_paisxx xsi:type="xsd:string">Nicaragua</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">168</cod_paises><nom_paisxx
  xsi:type="xsd:string">N�ger</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">169</cod_paises><nom_paisxx xsi:type="xsd:string">Nigeria</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">170</cod_paises><nom_paisxx
  xsi:type="xsd:string">Niue</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">1</cod_paises><nom_paisxx xsi:type="xsd:string">No Registrado</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">171</cod_paises><nom_paisxx
  xsi:type="xsd:string">Norfolk</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">172</cod_paises><nom_paisxx xsi:type="xsd:string">Noruega</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">173</cod_paises><nom_paisxx
  xsi:type="xsd:string">Nueva Caledonia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">174</cod_paises><nom_paisxx xsi:type="xsd:string">Nueva Zelanda</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">175</cod_paises><nom_paisxx
  xsi:type="xsd:string">Om�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">176</cod_paises><nom_paisxx xsi:type="xsd:string">Pakist�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">177</cod_paises><nom_paisxx
  xsi:type="xsd:string">Palaos</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">9</cod_paises><nom_paisxx xsi:type="xsd:string">Panama</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">179</cod_paises><nom_paisxx
  xsi:type="xsd:string">Pap�a Nueva Guinea</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">13</cod_paises><nom_paisxx xsi:type="xsd:string">Paraguay</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">7</cod_paises><nom_paisxx
  xsi:type="xsd:string">Peru</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">181</cod_paises><nom_paisxx xsi:type="xsd:string">Polinesia Francesa</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">182</cod_paises><nom_paisxx
  xsi:type="xsd:string">Polonia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">183</cod_paises><nom_paisxx xsi:type="xsd:string">Portugal</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">184</cod_paises><nom_paisxx
  xsi:type="xsd:string">Puerto Rico</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">186</cod_paises><nom_paisxx xsi:type="xsd:string">Reino Unido</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">68</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rep. Dem. del Congo</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">191</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rep�blica �rabe Saharaui Democr�tica</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">60</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rep�blica Centroafricana</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">62</cod_paises><nom_paisxx xsi:type="xsd:string">Rep�blica Checa</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">140</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rep�blica de Macedonia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">67</cod_paises><nom_paisxx xsi:type="xsd:string">Rep�blica del Congo</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">78</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rep�blica Dominicana</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">187</cod_paises><nom_paisxx xsi:type="xsd:string">Reuni�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">188</cod_paises><nom_paisxx
  xsi:type="xsd:string">Ruanda</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">189</cod_paises><nom_paisxx xsi:type="xsd:string">Rumania</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">190</cod_paises><nom_paisxx
  xsi:type="xsd:string">Rusia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">193</cod_paises><nom_paisxx xsi:type="xsd:string">Samoa</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">194</cod_paises><nom_paisxx
  xsi:type="xsd:string">Samoa Americana</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">195</cod_paises><nom_paisxx xsi:type="xsd:string">San Bartolom�</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">196</cod_paises><nom_paisxx
  xsi:type="xsd:string">San Crist�bal y Nieves</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">197</cod_paises><nom_paisxx xsi:type="xsd:string">San Marino</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">198</cod_paises><nom_paisxx
  xsi:type="xsd:string">San Mart�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">199</cod_paises><nom_paisxx
  xsi:type="xsd:string">San Pedro y Miquel�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">200</cod_paises><nom_paisxx
  xsi:type="xsd:string">San Vicente y las Granadinas</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">201</cod_paises><nom_paisxx
  xsi:type="xsd:string">Santa Helena, A. y T.</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">202</cod_paises><nom_paisxx xsi:type="xsd:string">Santa Luc�a</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">203</cod_paises><nom_paisxx
  xsi:type="xsd:string">Santo Tom� y Pr�ncipe</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">204</cod_paises><nom_paisxx xsi:type="xsd:string">Senegal</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">205</cod_paises><nom_paisxx
  xsi:type="xsd:string">Serbia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">206</cod_paises><nom_paisxx xsi:type="xsd:string">Seychelles</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">207</cod_paises><nom_paisxx
  xsi:type="xsd:string">Sierra Leona</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">208</cod_paises><nom_paisxx xsi:type="xsd:string">Singapur</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">209</cod_paises><nom_paisxx
  xsi:type="xsd:string">Siria</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">210</cod_paises><nom_paisxx xsi:type="xsd:string">Somalia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">211</cod_paises><nom_paisxx
  xsi:type="xsd:string">Sri Lanka</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">212</cod_paises><nom_paisxx xsi:type="xsd:string">Suazilandia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">213</cod_paises><nom_paisxx
  xsi:type="xsd:string">Sud�frica</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">214</cod_paises><nom_paisxx xsi:type="xsd:string">Sud�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">215</cod_paises><nom_paisxx
  xsi:type="xsd:string">Sud�n del Sur</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">19</cod_paises><nom_paisxx xsi:type="xsd:string">Suecia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">216</cod_paises><nom_paisxx
  xsi:type="xsd:string">Suiza</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">217</cod_paises><nom_paisxx xsi:type="xsd:string">Surinam</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">218</cod_paises><nom_paisxx
  xsi:type="xsd:string">Svalbard y Jan Mayen</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">219</cod_paises><nom_paisxx xsi:type="xsd:string">Tailandia</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">220</cod_paises><nom_paisxx
  xsi:type="xsd:string">Taiw�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">221</cod_paises><nom_paisxx xsi:type="xsd:string">Tanzania</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">222</cod_paises><nom_paisxx
  xsi:type="xsd:string">Tayikist�n</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">223</cod_paises><nom_paisxx
  xsi:type="xsd:string">Territorio Brit�nico del Oc�ano �ndico</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">224</cod_paises><nom_paisxx
  xsi:type="xsd:string">Territorios Australes Franceses</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">225</cod_paises><nom_paisxx xsi:type="xsd:string">Timor Oriental</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">226</cod_paises><nom_paisxx
  xsi:type="xsd:string">Togo</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">227</cod_paises><nom_paisxx xsi:type="xsd:string">Tokelau</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">228</cod_paises><nom_paisxx
  xsi:type="xsd:string">Tonga</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">229</cod_paises><nom_paisxx xsi:type="xsd:string">Trinidad y Tobago</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">230</cod_paises><nom_paisxx
  xsi:type="xsd:string">T�nez</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">232</cod_paises><nom_paisxx xsi:type="xsd:string">Turkmenist�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">233</cod_paises><nom_paisxx
  xsi:type="xsd:string">Turqu�a</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">234</cod_paises><nom_paisxx xsi:type="xsd:string">Tuvalu</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">235</cod_paises><nom_paisxx
  xsi:type="xsd:string">Ucrania</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">236</cod_paises><nom_paisxx xsi:type="xsd:string">Uganda</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">12</cod_paises><nom_paisxx
  xsi:type="xsd:string">Uruguay</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">237</cod_paises><nom_paisxx xsi:type="xsd:string">Uzbekist�n</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">238</cod_paises><nom_paisxx
  xsi:type="xsd:string">Vanuatu</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">4</cod_paises><nom_paisxx xsi:type="xsd:string">Venezuela</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">240</cod_paises><nom_paisxx
  xsi:type="xsd:string">Vietnam</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">243</cod_paises><nom_paisxx xsi:type="xsd:string">Wallis y Futuna</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">244</cod_paises><nom_paisxx
  xsi:type="xsd:string">Yemen</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">245</cod_paises><nom_paisxx xsi:type="xsd:string">Yibuti</nom_paisxx></item><item
  xsi:type="tns:InfoPaises"><cod_paises xsi:type="xsd:string">246</cod_paises><nom_paisxx
  xsi:type="xsd:string">Zambia</nom_paisxx></item><item xsi:type="tns:InfoPaises"><cod_paises
  xsi:type="xsd:string">247</cod_paises><nom_paisxx
  xsi:type="xsd:string">Zimbabue</nom_paisxx></item></dat_paises></ns1:getPaisesPolizaResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>`
  // function xmlToJson(xml) {
    // // Create the return object
    var obj = {};
  
    if (xml.nodeType == 1) {
      console.log('HOLAA')
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      obj = xml.nodeValue;
    }
  
    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
      return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
        return text + node.nodeValue;
      }, "");
    } else if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
  response.json(obj)
})

module.exports = { routesUserApp, routesUserWeb }
