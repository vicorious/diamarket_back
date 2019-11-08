'use strict'
const CategoryModel = require('../models/categorySchema')

class Category {

    async create(data) {
        const isExist = await CategoryModel.get({ name: data.name })
        if (!isExist._id) {
            const create = await CategoryModel.create(data)
            return create
        } else {
            return { error: 'La categoria ya existe' }
        }
    }

    async update(id, data) {
        const isExist = await CategoryModel.get({ _id: id })
        if (isExist) {
            const update = await CategoryModel.update(isExist._id, data)
            return update
        } else {
            return { error: 'No se ha actualizado' }
        }
    }

    async detailAll() {
        const getAll = await CategoryModel.search({})
        return getAll
    }

}

module.exports = new Category()