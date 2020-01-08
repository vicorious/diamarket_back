'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  orderId: {
    type: Types.ObjectId
  },
  idUser: {
    type: Types.ObjectId
  },
  status: {
    type: Types.String
  },
  description: {
    type: Types.String
  },
  clientId: {
    type: Types.ObjectId
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
      select: 'value direction methodPayment status superMarket products promotions user dateCreate',
      model: 'OrderService'
    }
    ]
  }
}

module.exports = new Delivery()
