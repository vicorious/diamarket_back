'use strict'
const CategoryModel = require('../models/categorySchema')

class Category {

    async create(data) {
        const isExist = await CategoryModel.get({ name: data.name })
        if (!isExist._id) {
            const create = await CategoryModel.create(data)
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'La categoria ya existe' }
        }
    }

    async update(id, data) {
        const isExist = await CategoryModel.get({ _id: id })
        if (isExist) {
            const update = await CategoryModel.update(isExist._id, data)
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No se ha actualizado' }
        }
    }

    async detailAll() {
        const getAll = await CategoryModel.search({})
        return { estado: true, data: getAll, mensaje: null }
    }

}

module.exports = new Category()