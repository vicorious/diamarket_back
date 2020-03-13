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
  idCatPost: {
    type: Types.String
  },
  name: {
    type: Types.String,
    lowercase: true,
    require: [true, 'El nombre es requerido']
  },
  description: {
    type: Types.String,
    lowercase: true,
    require: [true, 'La description']
  },
  image: {
    type: Types.String
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
