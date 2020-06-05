'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types
const Schema = new mongoose.Schema({
  category: {
    type: Types.ObjectId
  },
  subCategory: {
    type: Types.String
  },
  idPosProduct: {
    type: Types.Number
  }
})

class CategoryForMoment extends Base {
  constructor() {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('CategoryForMoment', Schema)
    this.fields = 'category subCategory idPosProduct'
  }
}

module.exports = new CategoryForMoment()