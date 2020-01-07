'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  idPos: {
    type: Types.Number,
    require: [true, 'El id es requerido']
  },
  name: {
    type: Types.String,
    require: [true, 'El nombre es requerido']
  },
  description: {
    type: Types.String,
    require: [true, 'La descripción es requerida']
  },
  category: {
    type: Types.String,
    require: [true, 'La categoria es requerida']
  },
  defaultprice: {
    type: Types.Number,
    require: [true, 'El precio es requerido']
  },
  image: [{
    type: Types.String,
    require: [true, 'La imagen es requerida']
  }]
})

class Product extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Product', Schema)
    this.fields = 'idPos name description category defaultprice image'
  }
}

module.exports = new Product()
