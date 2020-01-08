'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const categoryController = require('../controllers/categoryController')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const routesCategoryWeb = asyncify(express.Router())
const routesCategoryApp = asyncify(express.Router())

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
 *    decription: Se crea una nueva categoria
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
 *
 *
 */
routesCategoryWeb.put('/:id', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const update = await categoryController.update({ _id }, request.body)
  response.json(update)
})

routesCategoryWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail(_id)
  response.json(detail)
})

routesCategoryWeb.get('', isSuperAdmin, isAdmin, async (request, response) => {
  const all = await categoryController.all()
  response.json(all)
})

routesCategoryApp.get('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail({ _id })
  response.json(detail)
})

routesCategoryApp.get('', isClient, async (request, response) => {
  const all = await categoryController.all()
  response.json(all)
})

module.exports = { routesCategoryWeb, routesCategoryApp }
