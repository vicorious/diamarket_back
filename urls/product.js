'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const ProductController = require('../controllers/productController')
const { isAdmin, isClient, isSuperAdmin, isAdminAndIsSuperAdmin } = require('../middleware/token')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const routesProductApp = asyncify(express.Router())
const routesProductWeb = asyncify(express.Router())

routesProductWeb.get('/createpos', convertBase64ToFile, async (request, response) => {
  const create = await ProductController.createPost()
  response.json(create)
})

/**
 * @swagger
 * /web/product/{id}:
 *  put:
 *    tags:
 *      - Product
 *    description: Este endpoint se actualizan los datos
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in : path
 *      name: id
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      schema:
 *        $ref: '#/definitions/Product'
 *    responses:
 *      200:
 *        description: Si el producto se actualizo exitosamente se devuelve el siguiente objeto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: object
 *              properties:
 *                updated:
 *                  type: boolean
 *                  example: true
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si el producto no se actualiza se devuelve el siguiente error
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
 *              example: No se pudo actualizar el producto
 */
routesProductWeb.put('/:id', convertBase64ToFile, isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const data = request.body
  const update = await ProductController.update({ _id }, data)
  response.json(update)
})

/**
 * @swagger
 * /web/product/{quantity}/{page}?idSupermarket=idMongo OR idSupermarket=idMongo&name=nombredelproducto OR idSupermarket=idMongo&&category=idMongo:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si encuentra los productos del supermercado
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                properties:
 *                  isActive:
 *                    type: boolean
 *                    example: true
 *                  _id:
 *                    type: string
 *                    example: id de mongo
 *                  idSupermarket:
 *                    $ref: '#/definitions/Supermarket'
 *                  idProduct:
 *                    $ref: '#/definitions/Product'
 *                  quantity:
 *                    type: number
 *                    example: 4333
 *                  price:
 *                    type: number
 *                    example: 3444
 *            mensaje:
 *              type: string
 *              example: true
 *      400:
 *        description: Si el producto no existe se responde el siguiente json
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                exmaple: "array vacio"
 *            mensaje:
 *              type: string
 *              example: no existen productos
 */
routesProductWeb.get('/:quantity/:page', isSuperAdmin, async (request, response) => {
  const page = request.params.page
  const quantity = request.params.quantity
  const query = request.query
  if (query.idSupermarket && query.category) {
    console.log(query)
    const products = await ProductController.productsForCategory(query, quantity, page)
    response.json(products)
  } else if (query.name && query.idSupermarket) {
    query.name = { $regex: query.name, $options: 'i' }
    const products = await ProductController.productsForName(query, quantity, page)
    response.json(products)
  } else if (query.idSupermarket) {
    const products = await ProductController.all(query, quantity, page)
    response.json(products)
  } else {
    const products = await ProductController.all({}, quantity, page)
    response.json(products)
  }
})

/**
 * @swagger
 * /web/product/forsupermarket:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos de un supermercado
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Si encuentra los productos del supermercado
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Product'
 *            mensaje:
 *              type: string
 *              example: true
 *      400:
 *        description: Si el producto no existe se responde el siguiente json
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                exmaple: "array vacio"
 *            mensaje:
 *              type: string
 *              example: No existen productos para este supermercado
 */
routesProductWeb.get('/forsupermarket', isAdmin, async (request, response) => {
  const query = request.query
  const _id = request.User.id
  const products = await ProductController.forSuperMarket(_id, query)
  console.log(products)
  response.json(products)
})

routesProductWeb.post('/forcategory', isAdmin, async (request, response) => {
  const data = request.body
  const products = await ProductController.productsForCategory(data)
  response.json(products)
})

routesProductWeb.get('/detail/:id', isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await ProductController.detail({ _id })
  response.json(detail)
})

routesProductWeb.post('/forname', isSuperAdmin, isAdmin, async (request, response) => {
  const data = request.body
  const products = await ProductController.productsForName(data)
  response.json(products)
})

/**
 * @swagger
 * /app/product/forsupermarket/{id}:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos según el id de el supermercado
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
 *        description: Si encuentra los productos del supermercado
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Product'
 *            mensaje:
 *              type: string
 *              example: true
 *      400:
 *        description: Si el supermercado no tiene asignado productos
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                exmaple: "array vacio"
 *            mensaje:
 *              type: string
 *              example: "Este supermercado no tiene productos"
 */

routesProductApp.get('/forsupermarket/:id', async (request, response) => {
  const idSupermarket = request.params.id
  const products = await ProductController.productsSuperMarkets(idSupermarket)
  console.log(products)
  response.json(products)
})

/**
 * @swagger
 * /app/product/forcategory:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos según la categoria y el supermercado
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
 *          idSupermarket:
 *            type: string
 *            example: "5e17a913ebf3fa2ff83b97a3"
 *          category:
 *            type: string
 *            example: "5e17a913ebf3fa2ff83b97a3"
 *    responses:
 *      200:
 *        description: Si encuentra los productos del supermercado
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Product'
 *            mensaje:
 *              type: string
 *              example: true
 *      400:
 *        description: Si la categoria no posee productos
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                exmaple: "array vacio"
 *            mensaje:
 *              type: string
 *              example: "Esta categoria no tiene productos"
 */

routesProductApp.post('/forcategory', isClient, async (request, response) => {
  const data = request.body
  const products = await ProductController.productsForCategory(data)
  response.json(products)
})

/**
 * @swagger
 * /app/product/detail/{id}:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint detalla el producto
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
 *        description: Si encuentra el producto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Product'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no encuentra el producto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: "Array vacio"
 *            mensaje:
 *              type: string
 *              example: "No existe el producto"
 */

routesProductApp.get('/detail/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await ProductController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /app/product/forname:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint detalla un producto según el nombre y el supermercado
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
 *        properties:
 *          idSupermarket:
 *            type: string
 *            example: "5e17a913ebf3fa2ff83b97a3"
 *          name:
 *            type: string
 *            example: "Cereal"
 *      200:
 *        description: Si encuentra el producto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: true
 *            data:
 *              $ref: '#/definitions/Product'
 *            mensaje:
 *              type: string
 *              example: null
 *      400:
 *        description: Si no encuentra el producto
 *        schema:
 *          properties:
 *            estado:
 *              type: boolean
 *              example: false
 *            data:
 *              type: array
 *              items:
 *                type: string
 *                example: "Array vacio"
 *            mensaje:
 *              type: string
 *              example: "No existe productos cor este nombre"
 */

routesProductApp.post('/forname', isClient, async (request, response) => {
  const data = request.body
  const products = await ProductController.productsForName(data)
  response.json(products)
})

module.exports = { routesProductApp, routesProductWeb }
