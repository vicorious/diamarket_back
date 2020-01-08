const DeliveryModel = require('../models/deliverySchema')
const OrderModel = require('../models/orderServiceSchema')

class Delivery {
  async create (data) {
    const create = await DeliveryModel.create(data)
    return { estado: true, data: create, mensaje: null }
  }

  async update (_id, data) {
    const isExist = await DeliveryModel.get({ _id })
    if (isExist._id) {
      const order = await OrderModel.get({ _id: isExist.orderId })
      const update = await DeliveryModel.update(isExist._id, data)
      const updateOrder = await OrderModel.update(order._id, { status: data.status })
      return [update, updateOrder]
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta entrega' }
    }
  }

  async detail (_id) {
    const isExist = await DeliveryModel.get({ _id })
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta entrega' }
    }
  }
}

module.exports = new Delivery()
