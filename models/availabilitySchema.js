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
  idSupermarket: {
    type: Types.ObjectId,
    require: [true, 'El supermercado es requerido']
  },
  idProduct: {
    type: Types.ObjectId,
    require: [true, 'EL producto es requerido']
  },
  quantity: {
    type: Types.Number,
    require: [true, 'La cantidad es requerida']
  },
  price: {
    type: Types.Number,
    require: [true, 'El precio es requerido']
  },
  isActive: {
    type: Types.Boolean,
    default: true
  }
})

class Availability extends Base {
  constructor () {
    super()
    this.sort = { quantity: 1 }
    this.model = mongoose.model('Availability', Schema)
    this.fields = 'idSupermarket idProduct quantity price isActive'
    this.populate = [{ path: 'idProduct', select: '', model: 'Product' }, { path: 'idSupermarket', select: '', model: 'Supermarket' }]
  }
}

module.exports = new Availability()
