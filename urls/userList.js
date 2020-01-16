'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesUserListApp = asyncify(express.Router())
const UserListController = require('../controllers/userListController')
const { isClient } = require('../middleware/token')

/**
 * @swagger
 * /app/userlist/:
 *  post:
 *    tags:
 *      - UserList
 *    description: Este endpoint crea una lista de productos
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      type: object
 *      schema:
 *        properties:
 *          name:
 *            type: string
 *            example: "Para el desayuno"
 *          supermarket:
 *            type: string
 *            example: "5e178280c02a1c04e0dcc67b"
 *          products:
 *            type: array
 *            items:
 *              type: sting
 *              example: "5dd5b8c1f4e3a1511ad7c31e, 5dd5b8c1f4e3a1511ad7c31e"
 *      responses:
 *        200:
 *          description: Crea la lista de productos
 *          schema:
 *            properties:
 *              estado:
 *                type: boolean
 *                example: true
 *              data:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example: "5e178280c02a1c04e0dcc67b"
 *              mensaje:
 *                type: string
 *                example: null
 *        400:
 *          description: Error al crear el usuario
 *          schema:
 *            properties:
 *              estado:
 *                type: boolean
 *                example: false
 *              data:
 *                type: array
 *                items:
 *                  type: string
 *                  example: "array vacio"
 *              mensaje:
 *                type: string
 *                example: "Ya existe una lista con este nombre"
 */
routesUserListApp.post('', isClient, async (request, response) => {
  request.body.user = request.User.id
  const data = request.body
  const create = await UserListController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /app/userlist/{id}:
 *  put:
 *    tags:
 *      - UserList
 *    description: En este endpoint se actualiza una lista de un usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: path
 *      name: id
 *      requiered: true
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/UserList'
 *      responses:
 *        200:
 *          description: Actualiza una lista de productos
 *          schema:
 *            properties:
 *              estado:
 *                type: boolean
 *                example: true
 *              data:
 *                type: object
 *                properties:
 *                  update:
 *                    type: boolean
 *                    example: true
 *              mensaje:
 *                type: string
 *                example: null
 *        400:
 *          description: Error al crear el usuario
 *          schema:
 *            properties:
 *              estado:
 *                type: boolean
 *                example: false
 *              data:
 *                type: array
 *                items:
 *                  type: string
 *                  example: "array vacio"
 *              mensaje:
 *                type: string
 *                example: "No exite la lista de usuario"
 */
routesUserListApp.put('/:id', isClient, async (request, response) => {
  const id = request.params.id
  const data = request.body
  const update = await UserListController.update(id, data)
  response.json(update)
})

/**
 * @swagger
 * /app/userlist:
 *  get:
 *    tags:
 *      - UserList
 *    description: En este endpoint se traen todas las listas del usuario
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      required: true
 *    responses:
 *      200:
 *        description: Si el usuario tiene listas creadas se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/UserList'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el usuario no tiene listas creadas se devuelve el siguiente objeto
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
 *              example: 'No se encuentran listas creadas'
 */
routesUserListApp.get('', isClient, async (request, response) => {
  const user = request.User.id
  const search = await UserListController.all({ user })
  response.json(search)
})

/**
 * @swagger
 * /app/userlist/detail/{id}):
 *  get:
 *    tags:
 *      - UserList
 *    description: En este endpoint se detalla una lista del usuario en sesion
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
 *        description: Si la lista existe se devuelve el detalle dentro del siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/UserList'
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
 *              example: 'No existe la lista de usuario'
 */
routesUserListApp.get('/detail/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await UserListController.detail({ _id })
  response.json(detail)
})

module.exports = { routesUserListApp }
