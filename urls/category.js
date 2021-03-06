'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const categoryController = require('../controllers/categoryController')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const { isSuperAdmin, isAdmin, isClient, isAdminAndIsSuperAdmin } = require('../middleware/token')
const routesCategoryWeb = asyncify(express.Router())
const routesCategoryApp = asyncify(express.Router())

routesCategoryWeb.get('/createdatapos', async (request, response) => {
  const data = await categoryController.createDataPost()
  response.json(data)
})

routesCategoryWeb.get('/assigncategorypos', async (request, response) => {
  const data = await categoryController.assignCategoryPos()
  response.json(data)
})

routesCategoryWeb.get('/migrationnames', async (request, response) => {
  const data = await categoryController.migrateNamesCategory()
  response.json(data)
})
/**
 * @swagger
 * /web/category:
 *  post:
 *    tags:
 *      - Category
 *    decription: Se crea una nueva categoria
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
 *        $ref: '#/definitions/Category'
 *    responses:
 *      200:
 *        description: Si la categoria se registra correctamente devuelvo un objeto
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
 *                  example: sasdasddas
 *            mensaje:
 *              type: string
 *              example: null
 *
 *      400:
 *        description: Si el nombre de la categoria ya se encuentra registrado se devuelve el siguiente error
 *        schema:
 *          properties:
 *            error:
 *              type: string
 *              example: La categoria ya existe
 *
 *
 */
routesCategoryWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const data = request.body
  const create = await categoryController.create(data)
  response.json(create)
})

/**
 * @swagger
 * /web/category/{id}:
 *  post:
 *    tags:
 *      - Category
 *    description: Se crea una nueva categoria
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
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/Category'
 *    responses:
 *      200:
 *        description: Si la categoria se registra correctamente devuelvo un objeto
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
 *                  example: sasdasddas
 *            mensaje:
 *              type: string
 *              example: null
 *
 *      400:
 *        description: Si el nombre de la categoria ya se encuentra registrado se devuelve el siguiente error
 *        schema:
 *          properties:
 *            error:
 *              type: string
 *              example: La categoria ya existe
 */
routesCategoryWeb.put('/:id', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const update = await categoryController.update({ _id }, request.body)
  response.json(update)
})

routesCategoryWeb.get('/detail/:id', isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail(_id)
  response.json(detail)
})

routesCategoryWeb.get('', isAdminAndIsSuperAdmin, async (request, response) => {
  const all = await categoryController.all()
  response.json(all)
})

/**
 * @swagger
 * /app/category/detail/{id}:
 *  get:
 *    tags:
 *      - Category
 *    description: Se detalla una categoria
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
 *        description: Si la categoria existe se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Category'
 *            mensaje:
 *              type: string
 *              example: null
 *
 *      400:
 *        description: Si la categoria no existe se devuelve el siguiente error
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                example: 'Array vacio'
 *            mensaje:
 *              type: string
 *              example: 'No existe la categoria'
 */
routesCategoryApp.get('/detail/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /app/category:
 *  get:
 *    tags:
 *      - Category
 *    decription: Se traen todas las categorias registradas en la base de datos
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si existen categorias se devuelve el siguiente array
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Category'
 *            mensaje:
 *              type: string
 *              example: null
 *
 *      400:
 *        description: Si no existen categorias se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                example: 'Array vacio'
 *            mensaje:
 *              type: string
 *              example: 'No hay categorias'
 */
routesCategoryApp.get('', async (request, response) => {
  const all = await categoryController.allApp({ isActive: true })
  response.json(all)
})

module.exports = { routesCategoryWeb, routesCategoryApp }
