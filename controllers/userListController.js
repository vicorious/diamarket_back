'use strict'
const UserListModel = require('../models/userListSchema')

class Promotion {
  async create (data) {
    const isExist = await UserListModel.get({ name: data.name })
    if (!isExist._id) {
      const list = await UserListModel.create(data)
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'La promocion ya se encuentra resgitrada' }
    }
  }

  async update (_id, data) {
    const isExist = await UserListModel.get({ _id })
    if (isExist._id) {
      const update = await UserListModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta promoción' }
    }
  }

  async detail (_id) {
    const list = await UserListModel.get(_id)
    if (list._id) {
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta promoción' }
    }
  }

  async all (user) {
    const list = await UserListModel.search(user)
    if (list.length > 0) {
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se encuentra la promocion' }
    }
  }
}

module.exports = new Promotion()
