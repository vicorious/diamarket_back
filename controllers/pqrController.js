'use strict'

const PqrModel = require('../models/pqrSchema')
const UserModel = require('../models/userSchema')
const SuperMarketModel = require('../models/supermarketSchema')

class Pqr {
  async create (data) {
    const create = await PqrModel.create(data)
    return { estado: true, data: create, mensaje: null }
  }

  async getAll () {
    const data = await PqrModel.search({})
    return { estado: true, data: data, mensaje: null }
  }

  async detail (id) {
    const isExist = await PqrModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe la pqr' }
    }
  }

  async update (id, data) {
    const isExist = await PqrModel.get(id)
    if (isExist._id) {
      data.isResponse = true
      data.createUpdate = Date.now()
      const update = await PqrModel.update({ _id: isExist._id }, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El pqr no ha sido actualizado' }
    }
  }

  async allForUser (id) {
    const pqrs = await PqrModel.search({ client: id })
    if (pqrs.length > 0) {
      return { estado: true, data: pqrs, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen pqrs' }
    }
  }

  async bySupermarket (_id) {
    const user = await UserModel.get(_id)
    if (user._id) {
      const superMarket = await SuperMarketModel.get({ idAdmin: user._id })
      const pqrs = await PqrModel.search({ supermarket: superMarket._id })
      if (pqrs.length > 0) {
        return { estado: true, data: pqrs, mensaje: null }
      } else {
        return { estado: false, data: [], mensaje: 'No existen pqrs' }
      }
    } else {
      return { estado: false, data: [], mensaje: 'No existe el usuario' }
    }
  }
}

module.exports = new Pqr()
