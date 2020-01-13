'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  OrderService:
 *    type: object
 *    required:
 *    - value
 *    - direction
 *    - methodPayment
 *    - status
 *    - superMarket
 *    - products
 *    - promotions
 *    - user
 *    properties:
 *      value:
 *        type: number
 *      direction:
 *        type: string
 *      methodPayment:
 *        type: string
 *      status:
 *        type: number
 *      superMarket:
 *        $ref: '#/definitions/Supermarket'
 *      products:
 *        type: array
 *        items:
 *          properties:
 *            product:
 *              type: string
 *              example: id
 *            quantity:
 *              type: number
 *      promotions:
 *        type: array
 *        items:
 *          properties:
 *            promotion:
 *              type: string
 *              example: id
 *            quantity:
 *              type: number
 *      user:
 *        $ref: '#/definitions/User'
 *      dateCreate:
 *        type: string
 */

const Schema = new mongoose.Schema({
  value: {
    type: Types.Number,
    required: [true, 'El precio es requerido']
  },
  direction: {
    type: Types.String,
    required: [true, 'La direccion es requerida']
  },
  methodPayment: {
    type: Types.String,
    required: [true, 'El metodo de pago es requerido']
  },
  status: {
    type: Types.Number,
    required: [true, 'El status es requerido'],
    default: 1
  },
  superMarket: {
    type: Types.ObjectId,
    required: [true, 'El supermercado es requerido']
  },
  products: [{
    type: Types.Mixed
  }],
  promotions: [{
    type: Types.Mixed
  }],
  user: {
    type: Types.ObjectId,
    required: [true, 'El usuario es requerido']
  },
  dateCreate: {
    type: Types.Date,
    default: Date.now
  }
})
class OrderService extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('OrderService', Schema)
    this.fields = 'value direction methodPayment status superMarket products promotions user dateCreate '
    this.populate = [
      {
        path: 'superMarket',
        select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
        model: 'Supermarket'
      },
      {
        path: 'products',
        select: 'idPos name description category defaultprice image',
        model: 'Product'
      },
      {
        path: 'promotions',
        select: 'name supermarket products value image isActive',
        model: 'Promotion'
      },
      {
        path: 'user',
        select: 'id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite imageProfile birthday credits',
        model: 'User'
      }
    ]
  }
}

module.exports = new OrderService()
