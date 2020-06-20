'use strict'
const UserListModel = require('../models/userListSchema')

class UserList {
  async create (data) {
    const isExist = await UserListModel.get({ name: data.name })
    console.log(data)
    if (!isExist._id) {
      const list = await UserListModel.create(data)
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Ya existe una lista con este nombre' }
    }
  }

  async update (_id, data) {
    const isExist = await UserListModel.get({ _id })
    console.log(isExist)
    if (isExist._id) {
      const update = await UserListModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No exite la lista de usuario' }
    }
  }

  async deleteForId(_id,productId) {
    const isExist = await UserListModel.get({ _id })
    console.log(isExist)
    if (isExist._id) {
      let newProducts = []
      for (const product of isExist.products){
        if(product._id!=productId){
          newProducts.push(product)
        }
      }
      const update = await UserListModel.update(isExist._id, {products:newProducts})
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No exite la lista de usuario' }
    }
  }

  async detail (_id) {
    const list = await UserListModel.get(_id)
    console.log(list)
    if (list._id) {
      return { estado: true, data: list, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe la lista de usuario' }
    }
  }

  async all (user) {
    let list = await UserListModel.search(user)
    for (const object of list) {
      let calification = 0
      if(Array.isArray(object.supermarket.calification) && object.supermarket.calification.length > 0) {
        for (const element of object.supermarket.calification) {
          calification = parseInt(element) / object.supermarket.calification.length
        }
        object._doc.supermarket._doc.calification = calification
      } else {
        object._doc.supermarket._doc.calification = 0
      }
    }
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
