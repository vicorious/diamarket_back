'use-strict'
const SupermarketController = require('./supermarketController')
const user = require('./userController')
const PromotionController = require('./promotionController')

class Funtions {

    async createCode() {
        let uniqueCode = ""
        const possible = "0123456789"
        for (var i = 0; i < 6; i++) {
            uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return uniqueCode
    }

    async createRandomid() {
        let uniqueCode = ""
        const possible = "0123456789"
        for (var i = 0; i < 9; i++) {
            uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return uniqueCode
    }
    async createRandomquantity() {
        let uniqueCode = ""
        const possible = "0123456789"
        for (var i = 0; i < 3; i++) {
            uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return uniqueCode
    }

    async detailgeneral() {
        const supermarketAll = await SupermarketController.count()
        const supermarketNew = await SupermarketController.forMonth()
        const user = await SupermarketController.countGen()
        const promotionAll = await PromotionController.count()

        return {
            estado: true,
            data: [{
                supermarketAll,
                clientAll: user.userCount,
                serviceAll: user.countOrder,
                promotionAll,
                supermarketNew,
                serviceFinish: user.countOrderFinish,
                serviceWait: user.countOrderWait
            }],
            mensaje: null
        }
    }
}

module.exports = new Funtions()