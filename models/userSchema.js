'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types
const makePassword = require('../utils/makePassword')

const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    lowercase: true,
    require: [true, 'El email es requerido']
  },
  identification: {
    type: Types.String,
    require: [true, 'La identificacion es requerdia']
  },
  email: {
    type: Types.String,
    require: [true, 'El email es requerido']
  },
  cellPhone: {
    type: Types.String,
    require: [true, 'El numero de telefono es requerido']
  },
  supermarketFavorite: {
    type: Types.ObjectId
  },
  password: {
    type: Types.String,
    required: [true, 'La contraseña es requerida']
  },
  isActive: {
    type: Types.Boolean,
    default: false
  },
  birthday: {
    type: Types.Date
  },
  rol: {
    type: Types.String,
    required: [true, 'El rol es requerido']
  },
  verifyCode: {
    type: Types.String
  },
  dateCreate: {
    type: Types.Date,
    default: Date.now()
  },
  images: {
    type: Types.String
  },
  credits: {
    type: Types.String
  },
  logs: [{
    type: Types.Mixed
  }],
  cards: [{
    type: Types.Mixed
  }],
  directions: [{
    type: Types.Mixed
  }],
  userList: [{
    type: Types.Mixed
  }],
  order: [{
    type: Types.Mixed
  }]
})

Schema.pre('save', function (next) {
  this.password = makePassword(this.password)
  next()
})

Schema.index({ location: '2dsphere' })

class User extends Base {
  constructor () {
    super()
    this.sort = { email: 1 }
    this.model = mongoose.model('User', Schema)
    this.fields = '_id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite imageProfile birthday credits'
    this.populate = [{
      path: 'supermarketFavorite',
      select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
      model: 'Supermarket'
    }]
  }
}

module.exports = new User()
