const OrderServiceModel = require('../models/orderServiceSchema')
const UserModel = require('../models/userSchema')
const SuperMarketSchema = require('../models/supermarketSchema')
const DeliverySchema = require('../models/deliverySchema')
const PromotionSchema = require('../models/promotionSchema')

class OrderService {
  async create (data) {
    const order = await OrderServiceModel.create(data)
    if (order._id) {
      if (data.promotions) {
        let credits = 0
        for (const object of data.promotions) {
          const promotion = await PromotionSchema.get({ _id: object.promotion })
          credits += promotion.credits ? parseInt(promotion.credits) * parseInt(object.quantity) : 0
        }
        await UserModel.update(data.user, { credits })
      }
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se pudo crear la orden de servicio' }
    }
  }

  async all (data) {
    const orders = await OrderServiceModel.search(data)
    if (orders.length > 0) {
      return { estado: true, data: orders, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async detail (data) {
    const order = await OrderServiceModel.get(data)
    if (order._id) {
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay una orden asociada' }
    }
  }

  async edit (_id, data) {
    switch (data.status) {
      case 1: {
        // Notificacion al cliente de que se ha aceptado la solicitud por el supermercado
        return OrderServiceModel.update(_id, { status: 1 })
      }

      case 2: {
        // notificacion para el domiciliario
        const order = await OrderServiceModel.get({ _id })
        await DeliverySchema.create({ orderId: _id, idUser: data.idUser, status: 0, clientId: order.user._id })
        return OrderServiceModel.update(_id, { status: 2 })
      }

      case 3: {
        //Notificacion para el cliente
      }

      case 4: {

      }
    }
  }

  async forSupermarket (data) {
    const supermarket = await SuperMarketSchema.get(data)
    const orders = await OrderServiceModel.search({ superMarket: supermarket._id })
    if (orders.length > 0) {
      return { estado: true, data: orders, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async countGeneral () {
    const countsUsers = await UserModel.count({ rol: 'client' })
    const countOrder = await OrderServiceModel.count()
    const orders = await OrderServiceModel.search({})
    const countOrderFinish = await orders.filter(obj => obj.status === 'finalizada')
    const countOrderWait = await orders.filter(obj => obj.status === 'pendiente')
    return { countOrder, userCount: countsUsers, countOrderFinish: countOrderFinish.length, countOrderWait: countOrderWait.length }
  }
}

module.exports = new OrderService()
