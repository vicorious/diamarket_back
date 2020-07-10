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
 *        type: object
 *        properties:
 *          address:
 *            type: String
 *          location:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                example: Point
 *              coordinates:
 *                type: array
 *                items:
 *                  type: number
 *                  example: '12312312312312312, 3213123'
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
 *      referenceCode:
 *        type: string
 *      paymentStatus:
 *        type: number
 *        example: 0=pago, 1=Pendiente, 2=fallo por pago
 *      user:
 *        $ref: '#/definitions/User'
 *      dateCreate:
 *        type: string
 *      transactionId:
 *        type: string
 */

// status = 0 : pendiente, 1: aceptado: 2: asignada 3: proceso 4: finalizada 5: cancelada
const Schema = new mongoose.Schema({
  value: {
    type: Types.Number,
    required: [true, 'El precio es requerido']
  },
  direction: {
    type: Types.Mixed
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
  description: {
    type: Types.String,
    lowercase: true,
    default: 'No Asignada'
  },
  referenceCode: {
    type: Types.String,
    required: [true, 'La referencia de pago es obligatoria']
  },
  transactionId: {
    type: Types.String
  },
  paymentStatus: {
    type: Types.Number
  },
  codeCancelation: {
    type: Types.Number,
    default: 0
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
    this.fields = 'value direction methodPayment status superMarket products promotions user dateCreate codeCancelation paymentStatus transactionId referenceCode'
    this.populate = [
      {
        path: 'superMarket',
        select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
        model: 'Supermarket'
      },
      {
        path: 'products.product',
        select: 'idPos name description category defaultprice image',
        model: 'Product'
      },
      {
        path: 'promotions.promotion',
        select: 'name supermarket products value image isActive',
        model: 'Promotion'
      },
      {
        path: 'user',
        select: 'id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite imageProfile birthday credits  idSocket',
        model: 'User'
      }
    ]
  }
}

module.exports = new OrderService()
