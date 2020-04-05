'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types
const Schema = new mongoose.Schema({
  category: {
    type: Types.ObjectId
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
    this.fields = 'category idPosProduct'
  }
}

module.exports = new CategoryForMoment()