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

    async detailgeneral(){
        const supermarket = await SupermarketController.count()
        const user = await SupermarketController.countGen()
        const promotion = await PromotionController.count()
        return {supermarket, promotion,user}
    }
}

module.exports = new Funtions()