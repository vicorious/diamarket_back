'use strict'
const SupermarketModel = require('../models/supermarketSchema')

class Supermarket {
  async create (data) {
    const isExist = await SupermarketModel.get({ address: data.address })
    if (!isExist._id) {
      const create = await SupermarketModel.create(data)
      return { estado: true, data: create, mensaje: null }
    } else {
      return {
        estado: false,
        data: [],
        mensaje: 'Ya se encuentra registrado un supermercado con esa dirección'
      }
    }
  }

  async update (id, data) {
    const isExist = await SupermarketModel.get(id)
    if (isExist._id) {
      if (data.images) {
        if (isExist.images.length > 0) {
          const update = SupermarketModel.update(isExist._id, { $push: { images: data.images } })
          await SupermarketModel.update(isExist._id, data)
          return update
        } else {
          const update = await SupermarketModel.update(isExist._id, data)
          return update
        }
      } else {
        const update = await SupermarketModel.update(isExist._id, data)
        return update
      }
    } else {
      return { estado: false, data: [], mensaje: 'Datos no actualizados' }
    }
  }

  async detail (id) {
    const supermarket = await SupermarketModel.get(id)
    if (supermarket._id) {
      return { estado: true, data: supermarket, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'El supermercado no existe' }
    }
  }

  async rateSupermarket (_id, data) {
    const isExist = await SupermarketModel.get(_id)
    if (isExist._id) {
      const update = await SupermarketModel.update(isExist._id, { $push: { calification: data.calification } })
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El supermercado no existe' }
    }
  }

  async all () {
    const all = await SupermarketModel.search({})
    if (all.length > 0) {
      return { estado: true, data: all, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen supermercados' }
    }
  }

  // async count () {
  //   const count = await SupermarketModel.count()
  //   return count
  // }

  // async countGen () {
  //   let countOrder = 0
  //   let countOrderFinish = 0
  //   let countOrderWait = 0
  //   const userCount = await UserModel.count({ rol: 'client' })
  //   const data = await UserModel.search({ rol: 'client' })
  //   for (const user of data) {
  //     for (const order of user.order) {
  //       if (order.uid) countOrder++
  //     }
  //   }
  //   for (const user of data) {
  //     for (const order of user.order) {
  //       if (order.status === 'finalizada') {
  //         countOrderFinish++
  //       }
  //     }
  //   }
  //   for (const user of data) {
  //     for (const order of user.order) {
  //       if (order.status === 'pendiente') {
  //         countOrderWait++
  //       }
  //     }
  //   }
  //   return { countOrder, userCount, countOrderFinish, countOrderWait }
  // }

  // async forMonth () {
  //   const date = new Date()
  //   const dateNow = `${date.getMonth() + 1}-${date.getFullYear()}`
  //   const supermarkets = await SupermarketModel.search()
  //   let countSupermarket = 0
  //   for (const supermarket of supermarkets) {
  //     const dateSupermarket = `${supermarket.dateCreate.getMonth() +
  //       1}-${supermarket.dateCreate.getFullYear()}`
  //     if (dateNow === dateSupermarket) {
  //       countSupermarket++
  //     }
  //   }
  //   return countSupermarket
  // }
}

module.exports = new Supermarket()
