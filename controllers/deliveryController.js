const DeliveryModel = require('../models/deliverySchema')
const OrderServiceController = require('../controllers/orderServiceController')
const NotificationController = require('../controllers/notificacionController')
const UserModel = require('../models/userSchema')

class Delivery {
  async create (data) {
    const create = await DeliveryModel.create(data)
    return { estado: true, data: create, mensaje: null }
  }

  async all (data) {
    const orders = await DeliveryModel.search(data)
    if (orders.length > 0) {
      return { estado: true, data: orders, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async detail (_id) {
    const order = await DeliveryModel.get(_id)
    if (order._id) {
      const orderService = await OrderServiceController.detail({ _id: order.orderId })
      order._doc.orderId = orderService
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async edit (_id, data) {
    const order = await DeliveryModel.get({ _id })
    console.log(order.clientId._id)
    const user = await UserModel.get({ _id: order.clientId._id })
    switch (data.status) {
      case parseInt(1): {
        await OrderServiceController.edit(order.orderId._id, { status: 3 })
        return DeliveryModel.update(_id, { status: 1 })
      }

      case parseInt(2): {
        console.log(user)
        await NotificationController.messaging({ title: 'DiaMarket', body: 'El domiciliario va en camino con tu pedido', _id: order._id, status: 3, tokenMessaging: user.tokenCloudingMessagin })
        return DeliveryModel.update(_id, { status: 2 })
      }

      case parseInt(3): {
        await OrderServiceController.edit(order.orderId._id, { status: 4 })
        return DeliveryModel.update(_id, { status: 3 })
      }

      case parseInt(4): {
        const orderCodeCancelation = await OrderServiceController.detail({ _id: order.orderId._id, codeCancelation: data.codeCancelation })
        if (!orderCodeCancelation._id) {
          return OrderServiceController.edit(order.orderId._id, { status: 5 })
        } else {
          const cancelation = await OrderServiceController.edit(order.orderId._id, { codeCancelation: data.codeCancelation, status: 5 })
          console.log(cancelation)
          if (cancelation === 'error') {
            return { estado: false, data: [], mensaje: 'El codigo no conside con el de la cancelacion' }
          } else {
            return DeliveryModel.update(_id, { status: 4 })
          }
        }
      }
    }
  }
}

module.exports = new Delivery()
