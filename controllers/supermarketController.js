'use strict'

const SupermarketModel = require('../models/supermarketSchema')

class Supermarket {
    async create(data) {
        const isExist = await SupermarketModel.get({ address: data.address })
        if (isExist) {
            const create = await SupermarketModel.create(data)
            return create
        } else {
            return { error: 'Ya se encuentra registrado un supermercado con esa dirección' }
        }
    }
}

module.exports = new Supermarket()