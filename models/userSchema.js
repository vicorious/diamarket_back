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
 *            uid:
 *              type: string
 *            number:
 *              type: string
 *            token:
 *              type: string
 *            name:
 *              type: string
 *            identification:
 *              type: string
 *            paymentMethod:
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
  directionDefault: {
    type: Types.Mixed
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
  uidFireBase: {
    type: Types.String
  },
  tokenAuth : {
    type: Types.String
  },
  tokenCloudingMessagin: {
    type: Types.String
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
    type: Types.Number,
    default: 0
  },
  logs: [{
    type: Types.Mixed,
    default: []
  }],
  cards: [{
    type: Types.Mixed,
    default: []
  }],
  directions: [{
    type: Types.Mixed,
    default: []
  }],
  idSocket: {
    type: Types.String
  },
  country: {
    type: Types.ObjectId
  },
  city: {
    type: Types.ObjectId
  },
  state: {
    type: Types.ObjectId
  }
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
    this.fields = '_id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite  birthday credits image workingSupermarket tokenCloudingMessagin  idSocket country city state directionDefault'
    this.populate = [
      {
      path: 'supermarketFavorite',
      select: 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules dateCreate',
      model: 'Supermarket'
      },
      {
        path: 'country',
        select: 'name status',
        model: 'Country'
      },
      {
        path: 'state',
        select: 'name status',
        model: 'State'
      },
      {
        path: 'city',
        select: 'name status',
        model: 'City'
      }
    ]
  }
}

module.exports = new User()
