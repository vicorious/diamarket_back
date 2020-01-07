'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es requerido']
  },
  supermarket: {
    type: Types.ObjectId,
    required: [true, 'El supermercado es requerido']
  },
  products: [{
    type: Types.ObjectId,
    required: [true, 'Los productos son requeridos']
  }],
  user: {
    type: Types.ObjectId,
    required: [true, 'El usuario es requerido']
  }
})

class UserList extends Base {
  constructor () {
    super()
    this.sort = { description: 1 }
    this.model = mongoose.model('UserList', Schema)
    this.fields = 'name supermarket products user'
    this.populate = [
      {
        path: 'supermarket',
        select: 'status name address calification location neigborhood cellPhone locality email logo images isActive idAdmin schedules dateCreate',
        model: 'Supermarket'
      },
      {
        path: 'products',
        select: 'idPos name description category defaultprice image',
        model: 'Product'
      },
      {
        path: 'user',
        select: '_id isActive dateCreate logs cards directions userList order name identification email cellPhone rol supermarketFavorite imageProfile birthday credits',
        model: 'User'
      }
    ]
  }
}

module.exports = new UserList()