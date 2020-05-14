const OrderServiceModel = require('../models/orderServiceSchema')
const UserModel = require('../models/userSchema')
const SuperMarketSchema = require('../models/supermarketSchema')
const DeliverySchema = require('../models/deliverySchema')
const PromotionSchema = require('../models/promotionSchema')
const AvailabilitySchema = require('../models/availabilitySchema')
const PayUController = require('../controllers/payUController')
const NotificationController = require('../controllers/notificacionController')
const makeCode = require('../utils/makeCode')

class OrderService {
  async create(data) {
    if (!data.card.uid) {
      data.card._id = data.user
      const countOrder = await OrderServiceModel.count()
      const objectToken = await PayUController.tokenPayU(data.card)
      console.log(objectToken)
      data.card.token = objectToken.creditCardToken.creditCardTokenId
      data.card.securityCode = objectToken.creditCardToken.securityCode
      const user = await UserModel.get({ _id: data.user })
      data.user = user
      data.referenceCode = 'prueba1'
      if (parseInt(data.value) >= 10000) {
        // data.referenceCode = countOrder
        if (data.methodPayment.toLowerCase() === 'credit') {
          const paymentResponse = await PayUController.payCredit(data)
          console.log("paymentResponse")
          console.log(paymentResponse)
          switch (paymentResponse.status) {
            case 'APPROVED': {
              data.paymentStatus = 0
             // data.transactionId = paymentResponse.transactionResponse.transactionId
              const order = await OrderServiceModel.create(data)
              await this.validateOfferOrCreditsPromotions({ _id: user._id }, data.promotions)
              return { estado: true, data: order, mensaje: null }
            }

            case 'PENDING': {
              data.paymentStatus = 1
              //data.transactionId = paymentResponse.transactionResponse.transactionId
              await OrderServiceModel.create(data)
              delete paymentResponse.status
              return paymentResponse
            }

            case 'ERROR': {
              delete paymentResponse.status
              return paymentResponse
            }
          }
        }
      } else {
        return { estado: false, data: [], mensaje: 'El valor de su solicitud debe ser mayor a $10.000' }
      }
    } else {
      console.log("payu else")
      const countOrder = await OrderServiceModel.count()
      const user = await UserModel.get({ _id: data.user })
      const card = user.cards.find(element => element.uid === data.card.uid)
      data.user = user
      data.referenceCode = 'prueba1'
      data.card = card
      // data.referenceCode = countOrder
      if (parseInt(data.value) >= 10000) {
        if (data.methodPayment.toLowerCase() === 'credit') {
          const paymentResponse = await PayUController.payCredit(data)
          console.log(paymentResponse)
          switch (paymentResponse.status) {
            case 'APPROVED': {
              data.paymentStatus = 0
              data.transactionId = paymentResponse.transactionResponse.transactionId
              const order = await OrderServiceModel.create(data)
              await this.validateOfferOrCreditsPromotions({ _id: user._id }, data.promotions)
              return { estado: true, data: order, mensaje: null }
            }

            case 'PENDING': {
              data.paymentStatus = 1
              data.transactionId = paymentResponse.transactionResponse.transactionId
              await OrderServiceModel.create(data)
              delete paymentResponse.status
              return paymentResponse
            }

            case 'ERROR': {
              delete paymentResponse.status
              return paymentResponse
            }
          }
        }
      } else {
        return { estado: false, data: [], mensaje: 'El valor de su solicitud debe ser mayor a $10.000' }
      }
    }
  }

  async calculateValue (data) {
    const valueProducts = await this.calculateValueProducts(data.products)
    const valuePromotions = await this.calculateValuePromotions(data.promotions)
    const value = (parseInt(valueProducts) + parseInt(valuePromotions.value)) - parseInt(valuePromotions.discount)
    return { estado: true, data: value, mensaje: null }
  }

  async calculateValueProducts(products) {
    if (products.length > 0) {
      let value = 0
      for (const object of products) {
        const product = await AvailabilitySchema.get({ idProduct: object.product })
        value += parseInt(product.price) * parseInt(object.quantity)
      }
      return value
    } else {
      return 0
    }
  }

  async calculateValuePromotions(promotions) {
    if (promotions.length > 0) {
      let value = 0
      let discount = 0
      for (const object of promotions) {
        const promotion = await PromotionSchema.get({ _id: object.promotion })
        promotion.discount > 0 ? discount+= parseInt(promotion.discount) * parseInt(object.quantity) : discount += 0
        value += parseInt(promotion.value) * parseInt(object.quantity)
      }
      return { value, discount }
    } else {
      return 0
    }
  }

  async validateOfferOrCreditsPromotions(_id, promotions) {
    const user = UserModel.get(_id)
    let credits = 0
    parseInt(user.credits) === 0 ? credits = 0 : credits = parseInt(user.credits)
    if (promotions.length > 0) {
      for (const object of promotions) {
        const promotion = await PromotionSchema.get({ _id: object.promotion })
        credits += promotion.credits ? parseInt(promotion.credits) * parseInt(object.quantity) : 0
      }
      await UserModel.update(user._id, { credits })
    }
  }

  async all(data) {
    const orders = await OrderServiceModel.search(data)
    if (orders.length > 0) {
      return { estado: true, data: orders, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async detail(data) {
    const order = await OrderServiceModel.get(data)
    if (order._id) {
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay una orden asociada' }
    }
  }

  async edit(_id, data) {
    const order = await OrderServiceModel.get({ _id })
    console.log(order)
    const user = await UserModel.get({ _id: order.user._id })
    switch (data.status) {
      case parseInt(1): {
        // Notificacion al cliente de que se ha aceptado la solicitud por el supermercado
        await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden ha sido aceptada por el supermercado', _id: order._id, state: 1, tokenMessaging: 'du4KXqA6f2w:APA91bEcQeZyoj48aeI6w7MHHv0sxAuMp6msxL8tso6r4WLm2_EidmS5rON-JJIzLjDCew-h1yNe47JWzDAAToijYFXVHxUM8TST2LCzRh6CKcg1rQsQimQiQR4ksLG29zeMUqSZ7iEn' })
        return OrderServiceModel.update(_id, { status: 1 })
      }

      case parseInt(2): {
        await DeliverySchema.create({ orderId: _id, idUser: data.idUser, status: 0, clientId: order.user._id })
        return OrderServiceModel.update(_id, { status: 2 })
      }

      case parseInt(3): {
        // Notificacion para el cliente de que el domiciliario va en camino
        await NotificationController.messaging({ title: 'DiaMarket', body: 'El domiciliario va en camino con tu pedido', _id: order._id, status: 2, tokenMessaging: user.tokenCloudingMessagin })
        await OrderServiceModel.update(_id, data)
        break
      }

      case parseInt(4): {
        await OrderServiceModel.update(_id, data)
        break
      }

      case parseInt(5): {
        if (!data.codeCancelation) {
          const codeCancelation = makeCode()
          return OrderServiceModel.update(_id, { codeCancelation })
        } else {
          // Notificacion para el cliente de cancelacion de la orden
          if (order.codeCancelation === parseInt(data.codeCancelation)) {
            await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden de servicio ha sido cancelada', _id: order._id, state: 4, tokenMessaging: user.tokenCloudingMessagin })
            await OrderServiceModel.update(_id, { status: 5 })
          } else {
            return 'error'
          }
        }
        break
      }
    }
  }

  async forSupermarket(data) {
    const supermarket = await SuperMarketSchema.get(data)
    const orders = await OrderServiceModel.search({ superMarket: supermarket._id })
    if (orders.length > 0) {
      return { estado: true, data: orders, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async countGeneral() {
    const countsUsers = await UserModel.count({ rol: 'client' })
    const countOrder = await OrderServiceModel.count()
    const orders = await OrderServiceModel.search({})
    const countOrderFinish = await orders.filter(obj => obj.status === 'finalizada')
    const countOrderWait = await orders.filter(obj => obj.status === 'pendiente')
    return { countOrder, userCount: countsUsers, countOrderFinish: countOrderFinish.length, countOrderWait: countOrderWait.length }
  }

  async countOrdersForSupermarket(supermarket) {
    const countOrder = await OrderServiceModel.count({ superMarket: supermarket })
    const orders = await OrderServiceModel.search({ superMarket: supermarket })
    const countOrderFinish = await orders.filter(obj => parseInt(obj.status) === parseInt(4))
    const countOrderWait = await orders.filter(obj => parseInt(obj.status) === parseInt(0))
    return { countOrder, countOrderFinish: countOrderFinish.length, countOrderWait: countOrderWait.length }
  }
}

module.exports = new OrderService()
