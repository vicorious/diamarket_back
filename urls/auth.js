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
  const token = await Auth.createToken(data)
  response.json(token)
})

/**
 * @swagger
 * /app/auth:
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
routesAuthApp.post('', async (request, response) => {
  const data = request.body
  const token = await Auth.createToken(data)
  response.json(token)
})

/**
 * @swagger
 * /app/auth/social:
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
 *              example: 'El correo del usuario no existe'
 */
routesAuthApp.post('/social', async (request, response) => {
  const data = request.body
  const token = await Auth.createTokenSocial(data)
  response.json(token)
})

module.exports = { routesAuthApp, routesAuthWeb }
