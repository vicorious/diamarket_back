'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Supermarket:
 *    type: object
 *    required:
 *    - name
 *    - address
 *    - location
 *    - neigborhood
 *    - locality
 *    - email
 *    - supermarketType
 *    - logo
 *    - idAdmin
 *    - schedules
 *    properties:
 *      status:
 *        type: boolean
 *      cellPhone:
 *        type: string
 *      name:
 *        type: string
 *      address:
 *        type: string
 *      calification:
 *        type: array
 *        items:
 *          type: Number
 *      location:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *              example: Point
 *            coordinates:
 *              type: array
 *              items:
 *                type: number
 *                example: "3123123, 1321312"
 *      neigborhood:
 *        type: string
 *      locality:
 *        type: string
 *      email:
 *        type: string
 *      supermarketType:
 *        type: string
 *      logo:
 *        type: string
 *      images:
 *        type: array
 *        items:
 *          type: string
 *      isActive:
 *        type: boolean
 *      idAdmin:
 *        $ref: '#/definitions/User'
 *      schedules:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            schedulesInit:
 *              type: number
 *            schedulesFinish:
 *              type: number
 *            hourInit:
 *              type: date
 *            hourFinish:
 *              type: date
 *      dateCreate:
 *        type: string
 */
const Schema = new mongoose.Schema({
  supermarketIdPos: {
    type: Types.String
  },
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
    type: Types.Mixed
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
    type: Types.String
  },
  supermarketType: {
    type: Types.String
  },
  logo: {
    type: Types.String
  },
  images: [{
    type: Types.String
  }],
  isActive: {
    type: Types.Boolean,
    default: true
  },
  idAdmin: {
    type: Types.ObjectId
  },
  schedules: [{
    type: Types.Mixed
  }],
  idPos: {
    type: Types.String
  },
  dateCreate: {
    type: Types.Date,
    default: Date.now
  }
})

Schema.index({ location: '2dsphere' })

class Supermarket extends Base {
  constructor () {
    super()
    this.sort = { email: 1 }
    this.model = mongoose.model('Supermarket', Schema)
    this.fields = 'status name address calification location neigborhood cellPhone locality email logo images isActive idAdmin schedules dateCreate idPos'
    this.populate = [{ path: 'idAdmin', select: '_id name rol directions idetification email ', model: 'User' }]
  }
}

module.exports = new Supermarket()
