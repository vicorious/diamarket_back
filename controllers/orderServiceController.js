const OrderServiceModel = require('../models/orderServiceSchema')
const AvailabilityModel = require('../models/availabilitySchema')

class OrderService {
  async create (id, data) {
    let sumPrices = 0
    if (data.products) {
      const pro = data.products.map(async function (obj) {
        const product = await AvailabilityModel.get({ idProduct: obj, idSupermarket: data.superMarket })
        const productPrice = product.price
        sumPrices = sumPrices + productPrice
        return sumPrices
      })
      const arrayPrices = await Promise.all(pro)
      data.value = arrayPrices[arrayPrices.length - 1]
    }
    data.user = id
    const create = await OrderServiceModel.create(data)
    if (create._id) {
      return { estado: true, data: create, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Error al crear la orden' }
    }
  }

  async update (id, data) {
    const isExist = await OrderServiceModel.get(id)
    if (isExist._id) {
      const update = await OrderServiceModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No se ha encontrado la orden' }
    }
  }

  async detail (id) {
    const isExist = await OrderServiceModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se ha encontrado la orden' }
    }
  }

  async allForClien (user) {
    const isExist = await OrderServiceModel.search(user)
    if (isExist.length > 0) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se han encontrado ordenes' }
    }
  }
}

module.exports = new OrderService()
