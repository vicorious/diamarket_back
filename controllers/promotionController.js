'use strict'
const PromotionModel = require('../models/promotionSchema')

class Promotion {
    async count() {
        const count = await PromotionModel.count()
        return count
    }
}

module.exports = new Promotion()