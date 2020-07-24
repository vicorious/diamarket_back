'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Scheme = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es requerido'],
    lowercase: true
  },
  status: {
    type: Types.Boolean,
    default: true
  },
  state: {
    type: Types.ObjectId,
    ref: 'State',
    required: [true, 'El campo es requerido']
  }
})

Scheme.path('name').validate({
  isAsync: true,
  validator: (value, respond) => {
    mongoose.models['City'].findOne({ name: value }, (error, city) => {
      if (error) { }
      if (city) {
        respond(false)
      }
      respond()
    })
  },
  message: 'La ciudad ya existe'
})

class City extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('City', Scheme)
    this.fields = 'name status'
    this.populate = [{ path: 'state', select: 'name status', model: 'State' }]
  }
}

module.exports = new City()
