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
 * /web/product/{quantity}/{page}? OR idSupermarket=idMongo OR idSupermarket=idMongo&name=nombredelproducto OR idSupermarket=idMongo&&category=idMongo:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos segun la cantidad solicitada y el paginamiento
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: quantity
 *      type: number
 *      required: true
 *    - in: path 
 *      name: page
 *      type: number
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
routesProductWeb.get('/page/:quantity/:page', isSuperAdmin, async (request, response) => {
  const page = request.params.page
  const quantity = request.params.quantity
  const query = request.query
  if (query.idSupermarket && query.category) {
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
 * /web/product/forsupermarket/{quantity}/{page} OR &name=nombredelproductoafiltrar OR category=idmongo:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos de un supermercado segun la cantidad solicitada y la pagina
 *    produces:
 *    - applications/json
 *    parameters:
 *    - in: header
 *      name: Authorization
 *      type: string
 *      required: true
 *    - in: path
 *      name: quantity
 *      type: number
 *      requiered: true
 *    - in: page
 *      name: page
 *      type: number
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
routesProductWeb.get('/forsupermarket/:quantity/:page', isAdmin, async (request, response) => {
  const quantity = request.params.quantity
  const page = request.params.page
  const query = request.query
  const _id = request.User.id
  const products = await ProductController.forSuperMarket(_id, query, quantity, page)
  console.log(products)
  response.json(products)
})

routesProductWeb.get('/detail/:id', isAdminAndIsSuperAdmin, async (request, response) => {
  const _id = request.params.id
  console.log(_id)
  const detail = await ProductController.detail({ _id })
  response.json(detail)
})

/**
 * @swagger
 * /app/product/forsupermarket/{id}/{initquantity}/{finishquantity}:
 *  get:
 *    tags:
 *      - Product
 *    description: Este endpoint lista los productos según el id de el supermercado, si el page es 1 devuelvo 50 productos, si el page es 2 devuelvo el total de los productos restandoles los primeros 50 enviados
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
 *    - in: path
 *      name: initquantity
 *      type: number
 *      required: true
 *    - in: path
 *      name: finishquantity
 *      type: required
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

routesProductApp.get('/forsupermarket/:id/:initquantity/:finishquantity', isClient, async (request, response) => {
  const idSupermarket = request.params.id
  const initQuantity = request.params.initquantity
  const finishQuantity = request.params.finishquantity
  const products = await ProductController.productsSuperMarkets(idSupermarket, initQuantity, finishQuantity)
  response.json(products)
})

/**
 * @swagger
 * /app/product/forcategory/{initquantity}/{finishquantity}:
 *  post:
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
 *    - in: path
 *      name: initquantity
 *      type: number
 *      required: true
 *    - in: path
 *      name: finishquantity
 *      type: required
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

routesProductApp.post('/forcategory/:initquantity/:finishquantity', isClient, async (request, response) => {
  const initQuantity = request.params.initquantity
  const finishQuantity = request.params.finishquantity
  const data = request.body
  const products = await ProductController.productsForCategoryApp(data, initQuantity, finishQuantity)
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
 * /app/product/forname/{initquantity}/{finishquantity}:
 *  post:
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
 *    - in: path
 *      name: initquantity
 *      type: number
 *      required: true
 *    - in: path
 *      name: finishquantity
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

routesProductApp.post('/forname/:initquantity/:finishquantity', async (request, response) => {
  const initQuantity = request.params.initquantity
  const finishQuantity = request.params.finishquantity
  let data = request.body
  data.name = { $regex: data.name, $options: 'i' }
  const products = await ProductController.productsForNameMobile(data, initQuantity, finishQuantity)
  response.json(products)
})

module.exports = { routesProductApp, routesProductWeb }
