'use strict'
const SuperMarketController = require('./supermarketController')
const OrderServiceController = require('./orderServiceController')
const PromotionsController = require('./promotionController')
const OrderServiceModel = require('../models/orderServiceSchema')
const UserController = require('../controllers/userController')
const moment = require('moment')

class Dashboard {
  async targetCounterForSuperAdministrator () {
    const countSuperMarket = await SuperMarketController.countSuperMarket()
    const countSuperMarketForMont = await SuperMarketController.countSuperMarketForMonth()
    const countGeneralOrder = await OrderServiceController.countGeneral()
    const promotionCount = await PromotionsController.count()
    return { estado: true, data: { supermarketAll: countSuperMarket, clientAll: countGeneralOrder.userCount, serviceAll: countGeneralOrder.countOrder, promotionAll: promotionCount, supermarketNew: countSuperMarketForMont, serviceFinish: countGeneralOrder.countOrderFinish, serviceWait: countGeneralOrder.countOrderWait }, message: null }
  }

  async targetCounterForAdministrator (_id) {
    const user = await UserController.detail(_id)
    const clients = await UserController.countClientsForSuperMarket(user.data._doc.superMarket._id)
    const countOrdersSupermarket = await OrderServiceController.countOrdersForSupermarket(user.data._doc.superMarket._id)
    const promotionCount = await PromotionsController.countSupermarket(user.data._doc.superMarket._id)
    return { estado: true, data: { clientAll: clients, serviceAll: countOrdersSupermarket.countOrder, serviceFinish: countOrdersSupermarket.countOrderFinish, serviceWait: countOrdersSupermarket.countOrderWait, promotionAll: promotionCount }, menssage: null }
  }

  async countOrder (month) {
    const getMonth = month - 1
    const orders = await OrderServiceModel.search({})
    const orderCount = []
    for (const object of orders) {
      let count = 1
      const dateOrder = new Date(object.dateCreate)
      const newMonth = dateOrder.getMonth() + 1
      for (let i = getMonth; i >= 0; i--) {
        const resta = moment().subtract(i, 'months').format('M')
        if (newMonth === parseInt(resta)) {
          if (orderCount.length > 0) {
            let integer = 0
            for (const dataArray of orderCount) {
              if (dataArray.mes === newMonth) {
                count = orderCount[integer].total + 1
                orderCount[integer] = 0
              }
              integer++
            }
          }
          orderCount.push({ mes: newMonth, total: count })
          count++
        }
      }
    }
    const newArray = []
    for (const data of orderCount) {
      if (data !== 0) {
        newArray.push(data)
      }
    }
    return { estado: true, data: newArray, mensaje: null }
  }
}
module.exports = new Dashboard()
