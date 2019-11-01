'use strict'

const SupermarketModel = require('../models/supermarketSchema')

class Supermarket {
    async create(data) {
        const isExist = await SupermarketModel.get({ address: data.address })
        if (!isExist._id) {
            const create = await SupermarketModel.create(data)
            return create
        } else {
            return { error: 'Ya se encuentra registrado un supermercado con esa dirección' }
        }
    }

    async update(id, data) {
        const isExist = await SupermarketModel.get({ _id: id })
        if (isExist) {
            const update = await SupermarketModel.update(isExist._id, data)
            return update
        } else {
            return { error: 'No se ha actualizado' }
        }
    }

}

module.exports = new Supermarket()