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
 *        $ref: '#/definitions/Supermarket'
 *      products:
 *        $ref: '#/definitions/Product'
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
 */
const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es requerido']
  },
  supermarket: {
    type: Types.ObjectId,
    required: [true, 'El supermercado es requerido']
  },
  products: [{
    type: Types.ObjectId,
    required: [true, 'El producto es requerido']
  }],
  value: {
    type: Types.Number,
    required: [true, 'El valor es requerido']
  },
  credits: {
    type: Types.Number
  },
  discount: {
    type: Types.Number
  },
  image: [{
    type: Types.String,
    required: [true, 'La imagen es requerida']
  }],
  isActive: {
    type: Types.Boolean,
    default: true
  }
})
class Promotion extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Promotion', Schema)
    this.fields = 'name supermarket products value discount image isActive'
    this.populate = [{
      path: 'supermarket',
      select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
      model: 'Supermarket'
    },
    {
      path: 'products',
      select: 'idPos name description category defaultprice image',
      model: 'Product'
    }
    ]
  }
}

module.exports = new Promotion()
