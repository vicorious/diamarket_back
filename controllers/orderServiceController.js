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
const moment = require('moment')
const SuperMarketController = require('./supermarketController')
const CalificationController = require('../controllers/calificationController')
const MakeHour = require('../utils/makeHour')
const uuid = require('node-uuid')
const excel = require('exceljs')
const Path = require('path')

class OrderService {
  async create(data, io) {
    if (moment(data.dateService).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      data.isImmediate = true
    } else {
      data.isImmediate = false
    }
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
        await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
        await this.validateDirection(data.direction, user)
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
        await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
        await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
        await this.validateDirection(data.direction, user)
        return { estado: true, data: order, mensaje: null }
      }
    }
  }

  async validateDirection (direction, user) {
    let flagDirection = false
    if (user.directions.length > 0) {
      for (const item in user.directions) {
        if (user.directions[item].address === direction.address) {
          user._doc.directions[item].default = true
          flagDirection = true
        } else {
          user._doc.directions[item].default = false
        }
      }
      if (!flagDirection) {
        const idDirection = uuid.v4()
        user._doc.directions.push({ uid: idDirection, address: direction.address, location: direction.location, default: true })
        user._doc.directionDefault = { uid: idDirection, address: direction.address, location: direction.location, default: true }
      }
      await UserModel.update(user._id, user)
    } else {
      const idDirection = uuid.v4()
      user._doc.directions.push({ uid: idDirection, address: direction.address, location: direction.location, default: true })
      user._doc.directionDefault = { uid: idDirection, address: direction.address, location: direction.location, default: true }
      await UserModel.update(user._id, user)
    }
  }

  async credit(data) {
    const referenceDate = new Date()
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
            await this.validateDirection(data.direction, user)
            await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
            await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
            await this.validateOfferOrCreditsPromotions({ _id: user._id }, data.promotions)
          }
          return { estado: true, data: order, mensaje: null }
        }

        case 'PENDING': {
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
      const order = await OrderServiceModel.create(data)
      await this.validateDirection(data.direction, user)
      await UserModel.update(user._id, { supermarketFavorite: data.superMarket })
      await CalificationController.create({ orderService: order._id, user: user._id, supermarket: data.superMarket })
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
    return { estado: true, data: { delivery: amountMinunum[0].deliveryValue, minValue: amountMinunum[0].amountMininum, paymentGateway: amountMinunum[0].paymentGateway, notDelivery: amountMinunum[0].notDelivery} }
  }

  async calculateValueProducts(products, supermarket) {
    if (products.length > 0) {
      let value = 0
      for (const object of products) {
        const product = await AvailabilitySchema.get({ idProduct: object.product, idSupermarket: supermarket })

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
        if (object.products.length > 0) {
        for (const dataProduct of object.products) {
          const response = await ProductSchema.detail({ _id: dataProduct.product })
          if (response.data._id) {
            newProducts.push(response.data)
          }
        }
        orders[integer].products = newProducts
        }
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
        if (object.promotion._doc !== undefined) {
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
        const availability = await AvailabilitySchema.get({ idProduct: object.product._id, idSupermarket: supermarket })
        object.product._doc.price = availability.price
        object.product._doc.quantity = object.quantity
        delete object.quantity
        newProducts.push(object.product)
      }
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
      const calification = await (await CalificationController.detail({ orderService: order._id })).data
      if(calification._id) {
        delete calification._doc.user
        delete calification._doc.orderService
        order._doc.calification = calification
      }
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
      for (const object of order._doc.promotions) {
        for (const key in object.promotion.products) {
          object.promotion.products[key] = await (await ProductSchema.detail({ _id: object.promotion.products[key] })).data
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
        let credits = 0
        await NotificationController.messaging({ title: 'DiaMarket', body: 'Tu orden de servicio a finalizado', _id: order._id, status: 6, tokenMessaging: user.tokenCloudingMessagin })
        await OrderServiceModel.update(_id, data)
        const calification = await (await CalificationController.detail({ orderService: order._id })).data
        if (order.methodPayment.toString() === 'cash' || order.methodPayment.toString() === 'dataphone') {
          await OrderServiceModel.update(_id, { paymentStatus: 1 })
        }
        delete calification._doc.user
        delete calification._doc.orderService
        console.log("ORDER SERVICE CONTROLLER ORDER SERVICE,", order)
        console.log("calification", calification)
        if (order.promotions.length > 0) {
          for (const element of order.promotions) {
            if (element.promotion.credits > 0) {
              credits += element.promotion.credits * element.quantity
            }
          }
        }
        console.log("credits", credits)
        socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 6, calification, credits })
        break
      }

      case parseInt(5): {
        console.log("_------------------")
          console.log(_id, data)
          console.log("_------------------")
        if (!data.codeCancelation) {
          const codeCancelation = makeCode()
          return OrderServiceModel.update(_id, { codeCancelation })
        } else {
          // Notificacion para el cliente de cancelacion de la orden
          if (order.codeCancelation === parseInt(data.codeCancelation)) {
            await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden de servicio ha sido cancelada', _id: order._id, status: 5, tokenMessaging: user.tokenCloudingMessagin })
            await OrderServiceModel.update(_id, { status: 5, paymentStatus: 3 })
            socket.io.to(user.idSocket).emit('changeStatus', { _id: order._id, state: 5 })
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
    if (order._id) {
      return OrderServiceModel.update(order._id, { status: 5 })
    }
  }

  async cancelServicePse(order) {
    await NotificationController.messaging({ title: 'DiaMarket', body: 'Su orden de servicio ha sido cancelada', _id: order._id, status: 4, tokenMessaging: order.user.tokenCloudingMessagin })
    await OrderServiceModel.update(order._id, { status: 5 })
  }

  async forSupermarket(data, query) {
    console.log(data, query)
    const supermarket = await SuperMarketSchema.get(data)
    const orders = await OrderServiceModel.search({ superMarket: supermarket._id, $and: query.dateService})
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
    // data.polResponseCode = '1'
    console.log(data) 
    const order = await OrderServiceModel.get({ transactionId: data.transactionId })
    const user = await UserModel.get({ _id: order.user._id })
    switch (data.polResponseCode) {
      case '1': {
        await OrderServiceModel.update(order._id, { paymentStatus: 1 })
        const newOrder = await OrderServiceModel.get({ _id: order._id })
        if (newOrder.promotions.length > 0) {
          if (pasrseInt(newOrder.credits) > 0) {
            const credits = parseInt(user.credits) - parseInt(newOrder.credits)
            await UserModel.update(user._id, { credits })
          }
          await this.validateOfferOrCreditsPromotions(newOrder.user._id, newOrder.promotions)
        }
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción aprobada', status: true })
        // socket.io.emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        break
      }

      case '5': {
        await OrderServiceModel.update(order._id, { paymentStatus: 2 })
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción fallida', status: false })
        // socket.io.emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        await this.cancelServicePse(order)
        break
      }

      case '4': {
        await OrderServiceModel.update(order._id, { paymentStatus: 2 })
        console.log(user.idSocket)
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción rechazada', status: false })
        // socket.io.emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        await this.cancelServicePse(order)
        break
      }

      default: {
        await OrderServiceModel.update(order._id, { paymentStatus: 0 })
        const newOrder = await OrderServiceModel.get({ _id: order._id })
        socket.io.to(user.idSocket).emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        // socket.io.emit('payPse', { message: 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco.', status: true })
        break
      }
    }
  }

  async cronJob () {
    console.log("CRON JOB EJECUTADO CORRECTAMENTE")
    const currentDate = new Date()
    const orders = await OrderServiceModel.search({$and: [{dateService: { $gte: new Date(currentDate.setHours('01','00','00','00'))}}, {dateService: { $lte: new Date(currentDate.setHours('23','59','59','59')) }}, { status: 0 }]})
    for (const object of orders) {
      // const scheduleSupermarket = await SuperMarketController.schedulesSupermarket(object.superMarket._id)
      // for (const element of scheduleSupermarket) {
      //   if (moment(element.day).format('YYYY-MM-DD') === moment(object.dateService).format('YYYY-MM-DD')) {
      //     console.log(element.schedules)
      //   }
      // }
      console.log(object.hour.split("-")[1].split(" ")[1], object.hour.split("-")[1].split(" ")[2])
      const hourService = await MakeHour(object.hour.split("-")[1].split(" ")[1], object.hour.split("-")[1].split(" ")[2])
      currentDate.setHours(`${hourService.split(':')[0]}`, '00', '00', '00')
      console.log(moment(currentDate).format('HH:mm'), moment().format('HH:mm'))
      console.log(parseInt(moment().format('HHmm')) > parseInt(moment(currentDate).format('HHmm')))
      if (parseInt(moment().format('HHmm')) > parseInt(moment(new Date(currentDate)).format('HHmm'))) {
        const user = await UserModel.get({ _id: object.user._id })
        await NotificationController.messaging({ title: 'DiaMarket', body: 'Tu pedido ha sido cancelado, el supermercado no lo ha aceptado', _id: object._id, status: 5, tokenMessaging: user.tokenCloudingMessagin })
        await OrderServiceModel.update(object._id, { status: 5, paymentStatus: 3 })
      }
    }
    return orders
  }

  async report (_id, role, dateInit, dateFinish) {
    let orders
    if (role.toString() === 'superadministrator') {
      orders = await OrderServiceModel.search({$and: [{ dateService: { $gte: new Date(dateInit) }}, { dateService: { $lte: new Date(dateFinish) }}]})
    } else {
      const supermarket = await SuperMarketSchema.get({idAdmin: _id})
      orders = await OrderServiceModel.search({$and: [{ superMarket: supermarket._id }, { dateService: { $gte: new Date(dateInit) }}, { dateService: { $lte: new Date(dateFinish) }}]})
    }
    const route = `${Path.dirname(__dirname)}/public`
    const workBook = new excel.Workbook()
    const workSheet = workBook.addWorksheet('Servicios')
    workSheet.columns = [
      { header: '_id', key: '_id' },
      { header: 'Identificacion Cliente', key: 'identificationClient' },
      { header: 'Nombre Cliente', key: 'nameClient' },
      { header: 'Nombre Supermercado', key: 'nameSuperMarket' },
      { header: 'Dirección', key: 'address' },
      { header: 'Coordenadas', key: 'coordinates' },
      { header: 'Productos', key: 'products' },
      { header: 'Promociones', key: 'promotions' },
      { header: 'Fecha del servicio', key: 'dateService' },
      { header: 'Hora del servicio', key: 'hourService' },
      { header: 'Descripción', key: 'description' },
      { header: 'Metodo de pago', key: 'methodPayment' },
      { header: 'Valor', key: 'valuePayment' },
      { header: 'Referencia de pago', key: 'referenceCode' },
      { header: 'Estado de pago', key: 'paymentStatus' },
      { header: 'Estado del pedido', key: 'status' },
      { header: 'Codigo de cancelación', key: 'codeCancelation' },
      { header: 'Creditos pagados', key: 'credits' },
      { header: 'Fecha de creación', key: 'dateCreate' }
    ]
    if (orders.length > 0) {
      for (const object of orders) {
        let data = {
          _id: object._id,
          identificationClient: object.user.identification ? object.user.identification : 'N/A',
          nameClient: object.user.name ? object.user.name : 'N/A',
          nameSuperMarket: object.superMarket.name,
          address: object.direction.address,
          coordinates: `${object.direction.location.coordinates[0]}, ${object.direction.location.coordinates[1]}`,
          products: object.products.length > 0 ? await this.formatProductsForExcel(object.products) : 'N/A',
          promotions: object.promotions.length > 0 ? await this.formatPromotionsExcel(object.promotions): 'N/A',
          dateService: moment(object.dateService).format('YYYY-MM-DD'),
          hourService: object.hour,
          description: object.description ? object.description : 'N/A',
          methodPayment: object.methodPayment === 'cash' ? 'Efectivo' : object.methodPayment === 'credit' ? 'Tarjeta de credito' : object.methodPayment === 'PSE' ? 'PSE' : 'Dataphone',
          valuePayment: object.value,
          referenceCode: object.referenceCode ? object.referenceCode : 'N/A',
          paymetStatus: object.paymentStatus === 0 ? 'Pendiente' : object.paymentStatus === 1 ? 'Pago' : object.paymentStatus === 2 ? 'Fallo pago' : 'Fallo por cancelacion',
          status: object.status === 0 ? 'Pendiente' : object.status === 1 ? 'Aceptado por supermercado' : object.status === 2 ? 'Asignado a supermercado' : object.status === 3  ? 'En Camino' : object.status === 4 ? 'Entregado' : 'Cancelado',
          codeCancelation: object.codeCancelation ? object.codeCancelation : 'N/A',
          credits: parseInt(object.credits) > 0 ? object.credits: 'N/A' ,
          dateCreate: object.dateCreate
        }
        workSheet.addRow(data)
      }
      await workBook.xlsx.writeFile(`${route}/Servicios.xlsx`)
      return `${Path.dirname(__dirname)}/public/Servicios.xlsx`
    } else {
      await workBook.xlsx.writeFile(`${route}/Servicios.xlsx`)
      return `${Path.dirname(__dirname)}/public/Servicios.xlsx`
    }
  }

  async formatProductsForExcel (products) {
    let productsString = ''
    for (const object of products) {
      productsString += `${object.product.name} / ${object.quantity}, `
    }
    return productsString
  }

  async formatPromotionsExcel (promotions) {
    let promotionsString = ''
    for (const object of promotions) {
      promotionsString += `${object.promotion.name} / ${object.quantity}, `
    }
    return promotionsString
  }
}

module.exports = new OrderService()
