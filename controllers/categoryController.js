'use strict'
const CategoryModel = require('../models/categorySchema')

class Category {

    async create(data) {
        const isExist = await CategoryModel.get({ name: data.name })
        if (!isExist._id) {
            const create = await CategoryModel.create(data)
            return { estado: true, data: create, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'La categoria ya existe' }
        }
    }

    async detail(_id) {
        const isExist = await CategoryModel.get({ _id, isActive: true })
        if (isExist._id) {
            return { estado: true, data: isExist, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No existe la categoria' }
        }
    }

    async update(_id, data) {
        const isExist = await CategoryModel.get({ _id })
        if (isExist) {
            const update = await CategoryModel.update(isExist._id, data)
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No se ha actualizado' }
        }
    }

    async all() {
        const getAll = await CategoryModel.search({ isActive: true })
        if (getAll.length > 0) {
            return { estado: true, data: getAll, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "No hay categorias" }
        }

    }

}

module.exports = new Category()