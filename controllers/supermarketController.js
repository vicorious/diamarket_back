'use strict'

const SupermarketModel = require('../models/supermarketSchema')
const UserModel = require('../models/userSchema')

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

    async updateImage(_id, data) {
        const isExist = await SupermarketModel.get({ _id })
        if (isExist._id) {
            const image = []
            for (const images of isExist.images) {
                image.push(images)
            }
            for (const images of data.images) {
                image.push(images)
            }
            const updateImage = await SupermarketModel.update(isExist._id, { images: image })
            return updateImage
        } else {
            return { error: 'No existe el supermercado' }
        }
    }

    async detail(data) {
        const supermarket = await SupermarketModel.get({ _id: data })
        if (supermarket._id) {
            return supermarket
        } else {
            return { error: 'El supermercado no existe' }
        }
    }

    async detailAll() {
        const getAll = await SupermarketModel.search({})
        return getAll
    }
    async count() {
        const count = await SupermarketModel.count()
        return count
    }
    async countGen() {
        let countOrder=0
        const userCount = await UserModel.count({rol:'client'})
        const data = await UserModel.search({rol:'client'})
        for(const user of data){
            for(const order of user.order){
                countOrder++
            }
        }
        return {countOrder,userCount}
    }
}

module.exports = new Supermarket()