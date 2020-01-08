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
 *      methodPatyment:
 *        type: string
 *      status:
 *        type: number
 *      superMarket:
 *        type: string
 *      products:
 *        type: array
 *        items:
 *          type: string
 *          example: '5dc3493ee92df70280d9a63d, 5dd55aaeb5ac703603660beb'
 *      promotions:
 *        type: array
 *        items:
 *          type: string
 *          example: '5dc3493ee92df70280d9a63d, 5dd55aaeb5ac703603660beb'
 *      user:
 *        type: string
 *      dateCreate:
 *        type: string
 */

const Schema = new mongoose.Schema({
  value: {
    type: Types.Number,
    required: [true, 'El precio el requerido']
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
    required: [true, 'El status es requerido']
  },
  superMarket: {
    type: Types.ObjectId,
    required: [true, 'El supermercado es requerido']
  },
  products: [{
    type: Types.ObjectId,
    required: [true, 'El producto es requerido']
  }],
  promotions: [{
    type: Types.ObjectId,
    required: [true, 'La promocion es requerida']
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
