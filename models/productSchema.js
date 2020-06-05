'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Product:
 *    type: object
 *    required:
 *    - idPos
 *    - name
 *    - description
 *    - category
 *    - defaultPrice
 *    - image
 *    properties:
 *      idPos:
 *        type: string
 *      name:
 *        type: string
 *      description:
 *        type: string
 *      category:
 *        $ref: '#/definitions/Category'
 *      defaultPrice:
 *        type: boolean
 *      image:
 *        type: array
 *        items:
 *          type: string
 *      offert:
 *        type: number
 */
const Schema = new mongoose.Schema({
  idPos: {
    type: Types.Number,
    require: [true, 'El id es requerido']
  },
  name: {
    type: Types.String,
    lowercase: true,
    require: [true, 'El nombre es requerido']
  },
  description: {
    type: Types.String,
    lowercase: true,
    require: [true, 'La descripción es requerida']
  },
  category: {
    type: Types.ObjectId
  },
  subCategory: {
    type: Types.String
  },
  defaultPrice: {
    type: Types.Number
  },
  image: [{
    type: Types.String
  }],
  offert: {
    type: Types.Number,
    default: 0
  }
})

class Product extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Product', Schema)
    this.fields = 'idPos name description category defaultprice image offert subCategory'
    this.populate = [
      {
        path: 'category',
        select: 'name description image isActive',
        model: 'Category'
      }
    ]
  }
}

module.exports = new Product()
