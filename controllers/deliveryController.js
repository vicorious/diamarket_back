const DeliveryModel = require('../models/deliverySchema')
const UserController = require('../controllers/userController')
const UserModel = require('../models/userSchema')

class Delivery {
  async create (data) {
    const create = await DeliveryModel.create(data)
    return { estado: true, data: create, mensaje: null }
  }

  async update (_id, data) {
    const isExist = await DeliveryModel.get({ _id })
    if (isExist._id) {
      const user = await UserModel.get({ _id: isExist.clientId })
      const arrayOrder = []
      for (const orders of user.order) {
        if (orders._id === isExist.orderId.toString()) {
          orders.status = data.status
          arrayOrder.push(orders)
        } else {
          arrayOrder.push(orders)
        }
      }
      const update = await DeliveryModel.update(isExist._id, data)
      const updateOrder = await UserModel.update(user._id, { order: arrayOrder })
      return [update, updateOrder]
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta entrega' }
    }
  }

  async detail (_id) {
    const isExist = await DeliveryModel.get({ _id })
    if (isExist._id) {
      let count = 0
      const order = {
        _id: isExist._id,
        idUser: isExist.idUser,
        status: isExist.status,
        description: isExist.description
      }
      isExist.clientId.order.map((obj) => {
        if (obj._id == isExist.orderId.toString()) {
          order.orderId = obj
        }
        count++
      })
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta entrega' }
    }
  }
}

module.exports = new Delivery()
