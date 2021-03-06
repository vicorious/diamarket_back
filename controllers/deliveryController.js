const DeliveryModel = require('../models/deliverySchema')
const OrderServiceController = require('../controllers/orderServiceController')
const NotificationController = require('../controllers/notificacionController')
const UserModel = require('../models/userSchema')
const CalificationController = require('../controllers/calificationController')
const ProductSchema = require('../models/productSchema')
const moment = require('moment')

class Delivery {
  async create (data) {
    const create = await DeliveryModel.create(data)
    return { estado: true, data: create, mensaje: null }
  }

  async all (data, isImmediate) {
    const orders = await DeliveryModel.search({ idUser: data.idUser })
    if (orders.length > 0) {
      let newArray = []
      let date = moment()
      for (const object of orders) {
        if (isImmediate) {
          if (date.format('YYYY-MM-DD') === moment(object.orderId.dateService).format('YYYY-MM-DD')) {
            newArray.push(object)
          }
        } else {
          if (moment(object.orderId.dateService).isAfter(date)) {
            newArray.push(object)
          }
        } 
      }
      return { estado: true, data: newArray.reverse(), mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async detail (_id) {
    const order = await DeliveryModel.get(_id)
    if (order._id) {
      const orderService = await OrderServiceController.detail({ _id: order.orderId })
      order._doc.orderId = orderService.data
      for(const object of order._doc.orderId._doc.promotions) {
        for (const key in object.promotion.products) {
          object.promotion.products[key] = await ProductSchema.get({_id: object.promotion.products[key]})
        }
      }
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async edit (_id, data, socket) {
    const order = await DeliveryModel.get({ _id })
    const user = await UserModel.get({ _id: order.clientId._id })
    switch (data.status) {
      case parseInt(1): {
        await OrderServiceController.edit(order.orderId._id, { status: 3 }, socket)
        return DeliveryModel.update(_id, { status: 1 })
      }

      case parseInt(2): {
        await NotificationController.messaging({ title: 'DiaMarket', body: 'El domiciliario llego con tu pedido.', _id: order._id, status: 4, tokenMessaging: user.tokenCloudingMessagin })
        socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 4 })
        return DeliveryModel.update(_id, { status: 2 })
      }

      case parseInt(3): {
        await OrderServiceController.edit(order.orderId._id, { status: 4 }, socket)
        if (order.orderId.methodPayment.toString() === 'cash' || order.orderId.methodPayment.toString() === 'dataphone') {
          await OrderServiceController.edit(order.orderId._id, { paymentStatus: 3 })
          const user = await UserModel.get({ _id: order.orderId.user })
          const calification = await CalificationController.detail({ user: user._id, orderService: order.orderId._id })
          await NotificationController.messaging({ title: 'DiaMarket', body: 'Por favor califica el supermercado', _id: calification.data._id, supermarket: calification.data.supermarket.name, tokenMessaging: user.tokenCloudingMessagin })
          if ( parseInt(order.orderId.credits) > 0 ) {
            const credits = parseInt(user.credits) - parseInt(order.orderId.credits)
            await UserModel.update(user._id, { credits })
          }
          await OrderServiceController.validateOfferOrCreditsPromotions(user._id, order.orderId.promotions)
        }
        return DeliveryModel.update(_id, { status: 3 })
      }

      case parseInt(4): {
        // const orderCodeCancelation = await OrderServiceController.detail({ _id: order.orderId._id, codeCancelation: data.codeCancelation })
        if (!data.codeCancelation && data.codeCancelation === null) {
          return OrderServiceController.edit(order.orderId._id, { status: 5 }, socket)
        } else {
          const cancelation = await OrderServiceController.edit(order.orderId._id, { codeCancelation: data.codeCancelation, status: 5 }, socket)
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
