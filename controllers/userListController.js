'use strict'
const UserListModel = require('../models/userListSchema')

class UserList {
  async create (data) {
    const isExist = await UserListModel.get({ name: data.name })
    if (!isExist._id) {
      const list = await UserListModel.create(data)
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Ya existe una lista con este nombre' }
    }
  }

  async update (_id, data) {
    const isExist = await UserListModel.get({ _id })
    if (isExist._id) {
      const update = await UserListModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No exite la lista de usuario' }
    }
  }

  async detail (_id) {
    const list = await UserListModel.get(_id)
    if (list._id) {
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe la lista de usuario' }
    }
  }

  async all (user) {
    const list = await UserListModel.search(user)
    if (list.length > 0) {
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se encuentran listas creadas' }
    }
  }

  async delete (_id) {
    const list = await UserListModel.get(_id)
    if (list._id) {
      return UserListModel.delete(list._id)
    } else {
      return { estado: false, data: [], mensaje: 'No se encuentra la lista a borrar' }
    }
  }
}

module.exports = new UserList()
