'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types
const makePassword = require('../utils/makePassword')

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    required:
 *    - name
 *    - identification
 *    - email
 *    - cellPhone
 *    - password
 *    - rol
 *    properties:
 *      name:
 *        type: string
 *      identification:
 *        type: string
 *      email:
 *        type: string
 *      cellPhone:
 *        type: string
 *      supermaerketFavorite:
 *        type: string
 *        example: "id del supermercado"
 *      workingSupermarket:
 *        type: string
 *        example: "id del supermercado"
 *      password:
 *        type: string
 *      isActive:
 *        type: boolean
 *      birthday:
 *        type: string
 *      rol:
 *        type: string
 *      verifyCode:
 *        type: string
 *      dateCreate:
 *        type: string
 *      image:
 *        type: string
 *      credits:
 *        type: string
 *      logs:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            value:
 *              type: number
 *            date:
 *              type: string
 *            operation:
 *              type: boolean
 *      cards:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            number:
 *              type: string
 *            token:
 *              type: string
 *      directions:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            uid:
 *              type: string
 *            name:
 *              type: string
 *            address:
 *              type: string
 *            location:
 *              type: object
 *              properties:
 *                type:
 *                  type: string
 *                  example: Point
 *                coordinates:
 *                  type: array
 *                  items:
 *                    type: number
 *                    example: '12312312312312312, 3213123'
 */

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
  workingSupermarket: {
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
  image: {
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
    this.fields = '_id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite  birthday credits image workingSupermarket'
    this.populate = [{
      path: 'supermarketFavorite',
      select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
      model: 'Supermarket'
    }]
  }
}

module.exports = new User()
