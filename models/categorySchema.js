'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Category:
 *    type: object
 *    required:
 *    - name
 *    - description
 *    - image
 *    properties:
 *      name:
 *        type: string
 *      description:
 *        type: string
 *      image:
 *        type: string
 *      isActive:
 *        type: boolean
 */

const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    require: [true, 'El nombre es requerido']
  },
  description: {
    type: Types.String,
    require: [true, 'La description']
  },
  image: {
    type: Types.String,
    require: [true, 'la imagen es requerida']
  },
  isActive: {
    type: Types.Boolean,
    default: true
  }
})

class Category extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Category', Schema)
    this.fields = 'name description image isActive'
  }
}

module.exports = new Category()
