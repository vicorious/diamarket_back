const OrderServiceModel = require('../models/orderServiceSchema')
const UserModel = require('../models/userSchema')
const SuperMarketSchema = require('../models/supermarketSchema')
const DeliverySchema = require('../models/deliverySchema')
const PromotionSchema = require('../models/promotionSchema')
const AvailabilitySchema = require('../models/availabilitySchema')
const PayUController = require('../controllers/payUController')
const NotificationController = require('../controllers/notificacionController')
const ProductSchema = require('../controllers/productController')
const CategorySchema = require('../models/categorySchema')
const AmountsMininumSchema = require('../models/amountsMininumSchema')
const makeCode = require('../utils/makeCode')
const CalificationController = require('../controllers/calificationController')

class OrderService {
  async create(data, io) {
    console.log(data)
    switch (data.methodPayment.toLowerCase()) {
      case 'credit': {
        const order = await this.credit(data)
        return order
      }

      case 'cash': {
        const referenceDate = new Date()
        const user = await UserModel.get({ _id: data.user })
        data.user = user
        data.referenceCode = `Diamarket/${referenceDate.getTime()}`
        data.paymentStatus = 0
        data.transactionId = '0'
        const order = await OrderServiceModel.create(data)
        console.log(order)
        await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
        return { estado: true, data: order, mensaje: null }
      }

      case 'pse': {
        const order = await this.pse(data, io)
        return order
      }

      case 'dataphone': {
        const referenceDate = new Date()
        const user = await UserModel.get({ _id: data.user })
        data.user = user
        data.referenceCode = `Diamarket/${referenceDate.getTime()}`
        data.paymentStatus = 0
        data.transactionId = '0'
        const order = await OrderServiceModel.create(data)
        await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
        return { estado: true, data: order, mensaje: null }
      }
    }
  }

  async credit(data) {
    const referenceDate = new Date()
    console.log(data)
    const user = await UserModel.get({ _id: data.user })
    if (parseInt(data.value) > 0) {
      if (!data.card.uid) {
        data.card._id = data.user
        const objectToken = await PayUController.tokenPayU(data.card)
        if (objectToken.estado === false) {
          return objectToken
        } else {
          data.card.token = objectToken.creditCardToken.creditCardTokenId
          data.card.securityCode = objectToken.creditCardToken.securityCode
        }
      } else {
        const card = user.cards.find(element => element.uid === data.card.uid)
        data.card = card
      }
      data.user = user
      data.referenceCode = `Diamarket/${referenceDate.getTime()}`
      const paymentResponse = await PayUController.payCredit(data)
      console.log(paymentResponse)
      switch (paymentResponse.status) {
        case 'APPROVED': {
          data.paymentStatus = 1
          data.transactionId = paymentResponse.transactionResponse.transactionId
          const order = await OrderServiceModel.create(data)
          if (order._id) {
            if (parseInt(data.credits) > 0) {
              const credits = parseInt(user.credits) - data.credits
              await UserModel.update(user._id, { credits })
            }
            await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
            await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
            await this.validateOfferOrCreditsPromotions({ _id: user._id }, data.promotions)
          }
          return { estado: true, data: order, mensaje: null }
        }

        case 'PENDING': {
          console.log('............')
          console.log(paymentResponse)
          data.paymentStatus = 0
          data.transactionId = paymentResponse.transactionResponse.transactionId
          const order = await OrderServiceModel.create(data)
          await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
          delete paymentResponse.validateResponse.status
          return paymentResponse.validateResponse
        }

        case 'ERROR': {
          delete paymentResponse.status
          return paymentResponse
        }
      }
    } else {
      data.paymentStatus = 1
      data.transactionId = 'Pago con creditos'
      data.referenceCode = `Diamarket/${referenceDate.getTime()}`
      data.user = user._id
      console.log(user)
      const order = await OrderServiceModel.create(data)
      console.log(order)
      if (order._id) {
        if (parseInt(data.credits) > 0) {
          const credits = parseInt(user.credits) - data.credits
          await UserModel.update(user._id, { credits })
        }
        await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
        await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
        await this.validateOfferOrCreditsPromotions({ _id: user._id }, data.promotions)
      }
      return { estado: true, data: order, mensaje: null }
    }
  }

  async pse(data, io) {
    const reference = new Date()
    const user = await UserModel.get({ _id: data.user })
    data.referenceCode = `pseDiamarket${reference.getTime()}`
    data.user = user
    data.paymetStatus = 1
    // data.value = 10000
    const paymentPse = await PayUController.pse(data)
    if (paymentPse.status === 'PENDING') {
      data.transactionId = paymentPse.transaction
      data.paymentStatus = 0
      await OrderServiceModel.create(data)
    }
    // io.sockets.to(user.idSocket).emit('payPse', paymentPse) 
    return paymentPse
  }

  async calculateDiscountCredits(user, value) {
    if (user.credits > 0) {
      const cleanOrderValue = parseInt(value) - parseInt(user.credits)
      let discount = 0
      if (cleanOrderValue <= 0) {
        discount = value
      } else {
        if (cleanOrderValue >= 5000) {
          discount = user.credits
        } else {
          const difference = 5000 - cleanOrderValue
          discount = value - (difference + cleanOrderValue)
        }
      }
      return { value: value - discount, credits: discount, isDiscount: true }
    } else {
      return { value: value, credits: 0, isDiscount: false }
    }
  }

  async calculateValue() {
    const amountMinunum = await AmountsMininumSchema.search({})
    console.log(amountMinunum)
    return { estado: true, data: { delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, paymentGateway: amountMinunum[0].paymentGateway, notDelivery: amountMinunum[0].notDelivery} }
    const user = await UserModel.get({ _id: data.user })
    // const amountMinunum = await AmountsMininumSchema.search({})
    const valueProducts = await this.calculateValueProducts(data.products, data.supermarket)
    const valuePromotions = await this.calculateValuePromotions(data.promotions)
    let value = parseInt(valuePromotions) === undefined ? parseInt(valueProducts) : parseInt(valueProducts) + parseInt(valuePromotions)
    if (data.tip > 0) {
      value = value + data.tip
    }
    value = parseInt(value) + amountMinunum[0].deliveryValue
    if (value >= amountMinunum[0].amountMininum) {
      if (data.tip > 0) {
        value = value - data.tip
      }
      const discountedCredits = await this.calculateDiscountCredits(user, value)  
      switch (discountedCredits.isDiscount) {
        case true: {
          return { estado: true, data: { value: discountedCredits.value, delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, credits: discountedCredits.credits }, mensaje: null }
        }

        case false: {
          value = parseInt(value) - amountMinunum[0].deliveryValue
          if (parseInt(value) >= amountMinunum[0].amountMininum && parseInt(value) <= amountMinunum[0].notDelivery) {
            value = parseInt(value) + amountMinunum[0].deliveryValue
            return { estado: true, data: { value, delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, credits: 0 }, mensaje: null }
          } else if (parseInt(value) >= amountMinunum[0].notDelivery) {
            return { estado: true, data: { value, delivery: 0, minValue: amountMinunum[0].amountMininum, credits: 0 }, mensaje: null }
          } else {
            value = parseInt(value) + amountMinunum[0].deliveryValue
            if (parseInt(value) <= amountMinunum[0].notDelivery) {
              return { estado: false, data: { value, delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, credits: 0 }, mensaje: 'El valor de la orden debe ser mayor a $35.000' }
            } else {
              value = parseInt(value) + amountMinunum[0].deliveryValue
              return { estado: true, data: { value, delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, credits: 0 }, mensaje: null }
            }
          }
        }
      }
    } else {
      if (data.tip > 0) {
        value = value - data.tip
      }
      return { estado: false, data: { value, delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, credits: 0 }, mensaje: 'El valor de la orden debe ser mayor a $35.000' }
    }
  }

  async calculateValueProducts(products, supermarket) {
    if (products.length > 0) {
      let value = 0
      for (const object of products) {
        const product = await AvailabilitySchema.get({ idProduct: object.product, idSupermarket: supermarket })
        console.log(product.price)
        value += parseInt(product.price) * parseInt(object.quantity)
      }
      return value
    } else {
      return 0
    }
  }

  async calculateValuePromotions(promotions) {
    if (promotions !== undefined) {
      if (promotions.length > 0) {
        let value = 0
        let price = 0
        for (const object of promotions) {
          const promotion = await PromotionSchema.get({ _id: object.promotion })
          for (const elemet of promotion.products) {
            const availability = await AvailabilitySchema.get({ idProduct: elemet._id })
            price += availability.price
          }
          if (promotion.discount > 0) {
            value = Math.abs(((price * promotion.discount) / 100) - price)
            value = value * object.quantity
          } else if (promotion.credits > 0) {
            value = parseInt(price) * object.quantity
          } else {
            value = promotion.value * object.quantity
          }
          return value
        }
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  async validateOfferOrCreditsPromotions(_id, promotions) {
    console.log("promotions", promotions)
    const user = await UserModel.get(_id)
    let credits = 0
    // parseInt(user.credits) === 0 ? credits = 0 : credits = parseInt(user.credits)
    if (promotions !== undefined && promotions.length > 0) {
      for (const object of promotions) {
        let promotion = {}
        if (object.promotion._id) {
          promotion = object.promotion
        } else {
          promotion = await PromotionSchema.get({ _id: object.promotion })
        }
        credits += parseInt(promotion.credits) * parseInt(object.quantity)
      }
      credits = user.credits !== null && parseInt(user.credits) > 0 ? parseInt(credits) + parseInt(user.credits) : credits
      await UserModel.update({ _id: user._id }, { credits: credits })
    }
  }

  async all(data) {
    const orders = await OrderServiceModel.search(data)
    if (orders.length > 0) {
      let integer = 0
      for (const object of orders) {
        let newProducts = []
        for (const dataProduct of object.products) {
          const response = await ProductSchema.detail({ _id: dataProduct.product })
          if (response.data._id) {
            newProducts.push(response.data)
          }
        }
        orders[integer].products = newProducts
        integer++
      }
      return { estado: true, data: orders.reverse(), mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async allProduct(data) {
    const orders = await OrderServiceModel.search(data)
    if (orders.length > 0) {
      for (const object of orders) {
        // await this.formatSupermarket(object.superMarket)  
        const product = await this.formatProducts(object.products, object.superMarket._id)
        object._doc.products = product
        const promotions = await this.formatPromotions(object.promotions, object.superMarket._id)
        object._doc.promotions = promotions
      }
      return { estado: true, data: orders.reverse(), mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay ordenes asociadas' }
    }
  }

  async formatPromotions(promotions, supermarket) {
    if (promotions.length > 0) {
      let newPromotions = []
      for (const object of promotions) {
        let products = []
        let price = 0
        for (const index in object.promotion.supermarket) {
          const supermarket = await SuperMarketSchema.get({ _id: object.promotion.supermarket[index] })
          // const newSuperMarket = await this.formatSupermarket(supermarket)
          object.promotion._doc.supermarket[index] = supermarket
        }
        for (const key in object.promotion.products) {
          const product = await ProductSchema.detail({ _id: object.promotion.products[key] })
          const category = await CategorySchema.get({ _id: product.data.category })
          delete category._doc.subCategory
          delete product.data._doc.subCategory
          product.data._doc.category = category
          const availability = await AvailabilitySchema.get({ idProduct: product.data._id, idSupermarket: supermarket })
          product.data._doc.price = availability.price
          price += parseInt(availability.price)
          products.push(product.data)
        }
        object.promotion._doc.products = products
        object.promotion._doc.priceProducts = price
        if (object.promotion.credits === 0 && object.promotion.discount === 0) {
          object.promotion._doc.type = 'totalValue'
          object.promotion._doc.amount = object.promotion.value
          object.promotion._doc.value = 0
          delete object.promotion._doc.discount
          delete object.promotion._doc.credits
        } else if (object.promotion.credits > 0 && object.promotion.discount === 0) {
          object.promotion._doc.type = 'credits'
          object.promotion._doc.amount = object.promotion.value
          object.promotion._doc.value = object.promotion.credits
          delete object.promotion._doc.discount
          delete object.promotion._doc.credits
        } else if (object.promotion.discount > 0 && object.promotion.credits === 0) {
          object.promotion._doc.type = 'discount'
          object.promotion._doc.value = object.promotion._doc.discount
          object.promotion._doc.amount = Math.abs(((price * object.promotion.discount) / 100) - price)
          delete object.promotion._doc.discount
          delete object.promotion._doc.credits
        }
        price = 0
        object.promotion._doc.quantity = object.quantity
        newPromotions.push(object.promotion)
      }
      return newPromotions
    } else {
      return []
    }
  }

  async formatProducts(products, supermarket) {
    if (products.length > 0) {
      let newProducts = []
      for (const object of products) {
        const category = await CategorySchema.get({ _id: object.product.category })
        delete category._doc.subCategory
        object.product._doc.category = category
        console.log("_----------------------------------------")
        console.log(object)
        console.log(object.product._id, supermarket)
        console.log("_----------------------------------------")
        const availability = await AvailabilitySchema.get({ idProduct: object.product._id, idSupermarket: supermarket })
        console.log(availability)
        object.product._doc.price = availability.price
        object.product._doc.quantity = object.quantity
        delete object.quantity
        newProducts.push(object.product)
      }
      console.log(newProducts)
      return newProducts
    } else {
      return []
    }
  }

  async formatSupermarket(supermarket) {
    if (supermarket.calification.length > 0) {
      return supermarket
    } else {
      supermarket._doc.calification = 0
      return supermarket
    }
  }

  async detailApp(data) {
    let order = await OrderServiceModel.get(data)
    if (order._id) {
      await this.formatSupermarket(order.superMarket)
      if (order.products.length > 0) {
        const products = await this.formatProducts(order.products, order.superMarket)
        order._doc.products = products
      }
      if (order.promotions.length > 0) {
        const promotions = await this.formatPromotions(order.promotions, order.superMarket)
        order._doc.promotions = promotions
      }
      console.log(order)
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay una orden asociada' }
    }
  }

  async detail(data) {
    let order = await OrderServiceModel.get(data)
    if (order._id) {
      let newProducts = []
      for (const dataProduct of order.products) {
        const response = await ProductSchema.detail({ _id: dataProduct.product })
        if (response.data._id) {
          newProducts.push(response.data)
        }
      }
      order.products = newProducts
      return { estado: true, data: order, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay una orden asociada' }
    }
  }

  async edit(_id, data, socket) {
    const order = await OrderServiceModel.get({ _id })
    const user = await UserModel.get({ _id: order.user._id })
    switch (data.status) {
      case parseInt(1): {
        // Notificacion al cliente de que se ha aceptado la solicitud por el supermercado
        await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden ha sido aceptada por el supermercado', _id: order._id, status: 1, tokenMessaging: user.tokenCloudingMessagin })
        socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 1 })
        return OrderServiceModel.update(_id, { status: 1 })
      }

      case parseInt(2): {
        await DeliverySchema.create({ orderId: _id, idUser: data.idUser, status: 0, clientId: order.user._id })
        return OrderServiceModel.update(_id, { status: 2 })
      }

      case parseInt(3): {
        // Notificacion para el cliente de que el domiciliario va en camino
        await NotificationController.messaging({ title: 'DiaMarket', body: 'El domiciliario va en camino con tu pedido.', _id: order._id, status: 3, tokenMessaging: user.tokenCloudingMessagin })
        socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 3 })
        await OrderServiceModel.update(_id, data)
        break
      }

      case parseInt(4): {
        await NotificationController.messaging({ title: 'DiaMarket', body: 'Tu orden de servicio a finalizado', _id: order._id, status: 5, tokenMessaging: user.tokenCloudingMessagin })
        await OrderServiceModel.update(_id, data)
        const calification = await CalificationController.detail({ orderService: order._id })
        if (order.methodPayment.toString() === 'cash' || order.methodPayment.toString() === 'dataphone') {
          await OrderServiceModel.update(_id, { paymentStatus: 1 })
        }
        socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 5, idCalification: calification._id, supermarket: calification.supermarket.name })
        break
      }

      case parseInt(5): {
        if (!data.codeCancelation) {
          const codeCancelation = makeCode()
          return OrderServiceModel.update(_id, { codeCancelation })
        } else {
          // Notificacion para el cliente de cancelacion de la orden
          if (order.codeCancelation === parseInt(data.codeCancelation)) {
            await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden de servicio ha sido cancelada', _id: order._id, status: 4, tokenMessaging: user.tokenCloudingMessagin })
            await OrderServiceModel.update(_id, { status: 5 })
          } else {
            return 'error'
          }
        }
        break
      }
    }
  }

  async cancel(_id) {
    const order = await OrderServiceModel.get(_id)
    console.log(order)
    if (order._id) {
      return OrderServiceModel.update(order._id, { status: 5 })
    }
  }

  async cancelServicePse(order) {
    await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden de servicio ha sido cancelada', _id: order._id, state: 4, tokenMessaging: order.user.tokenCloudingMessagin })
    await OrderServiceModel.update(_id, { status: 5 })
  }

  async forSupermarket(data) {
    const supermarket = await SuperMarketSchema.get(data)
    const orders = await OrderServiceModel.search({ superMarket: supermarket._id })
    if (orders.length > 0) {
      return { estado: true, data: orders.reverse(), mensaje: null }
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

  async validateResponsePaymentPse(data, socket) {
    console.log(data)
    const order = await OrderServiceModel.get({ transactionId: data.transactionId })
    console.log("------------------ORDER----------------------")
    console.log(order)
    console.log("------------------ORDER----------------------")
    console.log(data.polResponseCode)
    data.polResponseCode = '1'
    const user = await OrderServiceModel.get({ _id: order.user._id })
    switch (data.polResponseCode) {
      case '1': {
        console.log("ENTRAAAAA")
        await OrderServiceModel.update(order._id, { paymentStatus: 1 })
        const newOrder = await OrderServiceModel.get({ _id: order._id })
        console.log(newOrder)
        if (newOrder.promotions.length > 0) {
          if (pasrseInt(newOrder.credits) > 0) {
            const credits = parseInt(user.credits) - parseInt(newOrder.credits)
            await UserModel.update(user._id, { credits })
          }
          await this.validateOfferOrCreditsPromotions(newOrder.user._id, newOrder.promotions)
        }

        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción aprobada', status: true })
        break
      }

      case '5': {
        await OrderServiceModel.update(order._id, { paymentStatus: 2 })
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción fallida', status: false })
        await this.cancelServicePse(order)
        break
      }

      case '4': {
        await OrderServiceModel.update(order._id, { paymentStatus: 2 })
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción rechazada', status: false })
        await this.cancelServicePse(order)
        break
      }

      default: {
        await OrderServiceModel.update(order._id, { paymentStatus: 0 })
        const newOrder = await OrderServiceModel.get({ _id: order._id })
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        break
      }
    }
  }
}

module.exports = new OrderService()
