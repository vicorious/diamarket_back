'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  client: {
    type: Types.ObjectId
  },
  description: {
    type: Types.String,
    required: [true, 'La descripción es requerida']
  },
  createDate: {
    type: Types.Date,
    default: Date.now
  },
  response: {
    type: Types.String
  },
  isResponse: {
    type: Types.Boolean,
    default: false
  },
  createUpdate: {
    type: Types.Date
  },
  supermarket: {
    type: Types.ObjectId
  },
  isFrequent: {
    type: Types.Boolean,
    default: false
  }
})

class Pqr extends Base {
  constructor () {
    super()
    this.sort = { description: 1 }
    this.model = mongoose.model('Pqr', Schema)
    this.fields = 'userId description createDate response isResponse createUpdate'
    this.populate = [{ path: 'userId', select: 'name', model: 'User' }]
  }
}

module.exports = new Pqr()
