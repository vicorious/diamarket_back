'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const Auth = require('../controllers/authController')

const routesAuthWeb = asyncify(express.Router())
const routesAuthApp = asyncify(express.Router())

/**
 * @swagger
 * /web/auth:
 *  post:
 *    tags:
 *      - Auth
 *    description: En este enpoint se hace la autenticacion del usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            example: nicolas@gmail.com
 *          password:
 *            type: string
 *            example: 6150
 *    responses:
 *      200:
 *        description: Si el usuario existe en la base de datos se response el siguiente json
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
 *                  example: json web token
 *                user:
 *                  $ref: '#/definitions/User'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no existe o la contraseña es incorrecta se devuelve el siguiente objeto
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
 *              example: 'Usuario no validado o usuario y/o contraseña incorrectos'
 */
routesAuthWeb.post('', async (request, response) => {
  const data = request.body
  console.log(data)
  const token = await Auth.createToken(data)
  response.json(token)
})

/**
 * @swagger
 * /web/auth/sendcode:
 *  post:
 *    tags:
 *      - Auth
 *    description: En este endpoint se envia el codigo para cambiar la contraseña
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: strign
 *            example: nicolas@gmail.com
 *    responses:
 *      200:
 *        description: Si el usuario existe en la base de datos se responde con el siguiente json
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
 *            message:
 *              type: string
 *              example: null
 *      400:
 *        description: si el usuario no existe se responde con el siguiente objeto
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
 *              example: El usuario no existe
 */
routesAuthWeb.post('/sendcode', async (request, response) => {
  const email = request.body.email
  const data = await Auth.sendCode({ email })
  response.json(data)
})

/**
 * @swagger
 * /web/auth/resetpassword:
 *  post:
 *    tags:
 *      - Auth
 *    description: En este endpoint cambia la contraseña del usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      schema:
 *        type: object
 *        properties:
 *          code:
 *            type: strign
 *            example: 543321
 *          password:
 *            type: string
 *            example: 6150
 *    responses:
 *      200:
 *        description: Si el usuario existe en la base de datos se responde con el siguiente json
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
 *            message:
 *              type: string
 *              example: null
 *      400:
 *        description: si el usuario no existe se responde con el siguiente objeto
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
 *              example: El usuario no existe
 */
routesAuthWeb.post('/resetpassword', async (request, response) => {
  const data = request.body
  const resetPassword = await Auth.resetPassword(data)
  response.json(resetPassword)
})

/**
 * @swagger
 * /app/auth:
 *  post:
 *    tags:
 *      - Auth
 *    description: En este enpoint se hace la autenticacion del usuario o se registra por primera vez
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: body
 *      name: body
 *      schema:
 *        type: object
 *        properties:
 *          token:
 *            type: string
 *            example: token de firebase
 *          tokenCloudingMessagin:
 *            type: string
 *            example: token para el envio de notificaciones
 *    responses:
 *      200:
 *        description: Si el usuario existe en la base de datos o no existe se crea o se actualiza y se responde el siguiente objeto
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
 *                  example: json web token
 *                user:
 *                  $ref: '#/definitions/User'
 *            mensaje:
 *              type: string
 *              example: null
 */
routesAuthApp.post('', async (request, response) => {
  console.log('---------------')
  console.log(request.io)
  console.log('---------------')

  const { clientId } = request.io
  console.log(clientId)
  request.body.idSocket = clientId
  const data = request.body
  // const tokenGenerate = await FirebaseAdmin.auth().createCustomToken(id)
  console.log(data)
  if (data.email) {
    const token = await Auth.createTokenApp(data)
    response.json(token)
  } else {
    const token = await Auth.createTokenFirebase(data)
    response.json(token)
  }
})

module.exports = { routesAuthApp, routesAuthWeb }
