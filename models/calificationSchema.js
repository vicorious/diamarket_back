'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  user: {
    type: Types.ObjectId
  },
  supermarket: {
    type: Types.ObjectId
  },
  orderService: {
    type: Types.ObjectId
  },
  calification: {
      type: Types.Number,
      default: 0
  },
  createAt: {
      type: Types.Date,
      default: Date.now
  }
})

class Calification extends Base {
  constructor () {
    super()
    this.model = mongoose.model('Calification', Schema)
    this.fields = 'user supermarket orderService calification'
    this.populate = [
        { path: 'user', select: '_id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite  birthday credits image workingSupermarket tokenCloudingMessagin  idSocket country city state', model: 'User' },
        { path: 'supermarket', select: 'status name address calification location neigborhood cellPhone locality email logo images isActive idAdmin schedules dateCreate idPos', model: 'Supermarket' },
        { path: 'orderService', select: 'value direction methodPayment status superMarket products promotions user dateCreate codeCancelation paymentStatus transactionId referenceCode dateService hour', model: 'OrderService' }
    ]
  }
}

module.exports = new Calification()
