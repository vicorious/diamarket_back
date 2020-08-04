'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Delivery:
 *    type: object
 *    required:
 *    - orderId
 *    - idUser
 *    - status
 *    - description
 *    - clientId
 *    properties:
 *      orderId:
 *        $ref: '#/definitions/OrderService'
 *      idUser:
 *        $ref: '#/definitions/User'
 *      status:
 *        type: string
 *      description:
 *        type: string
 *      clientId:
 *        $ref: '#/definitions/User'
 */

// status: 0: asignado, 1: inicio, 2: llegue, 3: Entregado, 4: cancelar
const Schema = new mongoose.Schema({
  orderId: {
    type: Types.ObjectId,
    required: [true, 'La orden es requerida']
  },
  idUser: {
    type: Types.ObjectId,
    required: [true, 'El domiciliario es requerido']
  },
  status: {
    type: Types.String,
    required: [true, 'El estado es requerido']
  },
  clientId: {
    type: Types.ObjectId,
    required: [true, 'El cliente es requerido']
  }
})

class Delivery extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Delivery', Schema)
    this.fields = 'orderId idUser status description clientId'
    this.populate = [{
      path: 'idUser clientId',
      select: 'name identification email cellPhone',
      model: 'User'
    },
    {
      path: 'orderId',
      select: 'value direction methodPayment status superMarket products promotions user dateCreate credits',
      model: 'OrderService'
    }
    ]
  }
}

module.exports = new Delivery()
