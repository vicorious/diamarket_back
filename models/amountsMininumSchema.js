const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

/**
 * @swagger
 * definitions:
 *  Availibility:
 *    type: object
 *    required:
 *    - idSupermarket
 *    - idProduct
 *    - quantity
 *    - price
 *    properties:
 *      idSupermarket:
 *        $ref: '#/definitions/Supermarket'
 *      idProduct:
 *        $ref: '#/definitions/Product'
 *      quantity:
 *        type: string
 *      price:
 *        type: number
 *      isActive:
 *        type: boolean
 */

const Schema = new mongoose.Schema({
  amountMininum : {
    type: Types.Number
  },
  deliveryValue: {
    type: Types.Number
  },
  notDelivery: {
      type: Types.Number
  },
  paymentGateway: {
    type: Types.Number
  }
})

class AmountsMininum extends Base {
  constructor() {
    super()
    this.sort = { quantity: 1 }
    this.model = mongoose.model('AmountsMininum', Schema)
    this.fields = 'amountMininum deliveryValue notDelivery paymentGateway'
  }
}

module.exports = new AmountsMininum()
