'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Promotion:
 *    type: object
 *    required:
 *    - name
 *    - supermarket
 *    - products
 *    - value
 *    - image
 *    properties:
 *      name:
 *        type: string
 *      supermarket:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Supermarket'
 *      products:
 *        type: array
 *        items:
 *          type: string
 *          example: id de mongo
 *      value:
 *        type: Number
 *      credits:
 *        type: Number
 *      discount:
 *        type: Number
 *      image:
 *        type: array
 *        items:
 *          type: string
 *      isActive:
 *        type: boolean
 *      initDate:
 *        type: string
 *      finishDate:
 *        type: string
 */
const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es requerido']
  },
  supermarket: [{
    type: Types.ObjectId,
    required: [true, 'El supermercado es requerido']
  }],
  products: [{
    type: Types.ObjectId,
    required: [true, 'El producto es requerido']
  }],
  value: {
    type: Types.Number,
    default: 0
  },
  credits: {
    type: Types.Number,
    default: 0
  },
  discount: {
    type: Types.Number,
    default: 0
  },
  image: [{
    type: Types.String,
    default: [],
    required: [true, 'La imagen es requerida']
  }],
  isActive: {
    type: Types.Boolean,
    default: true
  },
  initDate: {
    type: Types.Date
  },
  finishDate: {
    type: Types.Date
  },
  flagPromotion: {
    type: Types.Boolean,
    default: false
  }
})
class Promotion extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Promotion', Schema)
    this.fields = 'name supermarket products value discount credits image isActive initDate finishDate flagPromotion'
    this.populate = [{
      path: 'supermarket',
      select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
      model: 'Supermarket'
    },
    {
      path: 'products',
      select: '',
      model: 'Product'
    }
    ]
  }
}

module.exports = new Promotion()
