'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  status: {
    type: Types.Boolean,
    default: true
  },
  cellPhone: {
    type: Types.String
  },
  name: {
    type: Types.String,
    require: [true, 'El nombre es requerido']
  },
  address: {
    type: Types.String,
    require: [true, 'La dirección es requerida']
  },
  calification: [{
    type: Types.Number
  }],
  location: {
    type: Types.Mixed,
    require: [true, 'La localización es requerida']
  },
  neigborhood: {
    type: Types.String,
    require: [true, 'El barrio es requerido']
  },
  locality: {
    type: Types.String,
    require: [true, 'La localidad es requerida']
  },
  email: {
    type: Types.String,
    require: [true, 'El email es requerido']
  },
  supermaketType: {
    type: Types.String,
    required: [true, 'El tipo de supermercado es requerido']
  },
  logo: {
    type: Types.String,
    require: [true, 'El logo es requerido']
  },
  images: [{
    type: Types.String
  }],
  isActive: {
    type: Types.Boolean,
    default: true
  },
  idAdmin: {
    type: Types.ObjectId,
    require: [true, 'El id es requerido']
  },
  schedules: [{
    type: Types.Mixed,
    require: [true, 'El horario es requerido']
  }],
  dateCreate: {
    type: Types.Date,
    default: Date.now()
  }
})

Schema.index({ location: '2dsphere' })

class Supermarket extends Base {
  constructor () {
    super()
    this.sort = { email: 1 }
    this.model = mongoose.model('Supermarket', Schema)
    this.fields = 'status name address calification location neigborhood cellPhone locality email logo images isActive idAdmin schedules dateCreate'
    this.populate = [{ path: 'idAdmin', select: '_id name rol directions idetification email ', model: 'User' }]
  }
}

module.exports = new Supermarket()
