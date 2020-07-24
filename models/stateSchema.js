'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es obligatorio'],
    lowercase: true
  },
  status: {
    type: Types.Boolean,
    default: true
  },
  country: {
    type: Types.ObjectId,
    ref: 'Country',
    required: [true, 'El Campo de pais es requerido']
  }
})

Schema.path('name').validate({
  isAsync: true,
  validator: (value, respond) => {
    mongoose.models['State'].findOne({ name: value }, (error, state) => {
      if (error) {}
      if (state) {
        respond(false)
      }
      respond()
    })
  },
  message: 'El pais ya existe'
})

class State extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('State', Schema)
    this.fields = 'name status'
    this.populate = [{ path: 'country', select: 'name status', model: 'Country' }]
  }
}

module.exports = new State()
