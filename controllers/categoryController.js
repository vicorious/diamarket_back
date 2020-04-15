'use strict'
const CategoryModel = require('../models/categorySchema')
const ProductModel = require('../models/productSchema')
const productsForCategorySchema = require('../models/productsForCategorySchema')
const MsSql = require('mssql')

class Category {
  async createDataPost() {
    const category = await MsSql.query`
    SELECT f125_rowid_item , dbo.t125_mc_items_criterios.f125_id_plan, dbo.t106_mc_criterios_item_mayores.f106_id, dbo.t106_mc_criterios_item_mayores.f106_descripcion
    FROM (dbo.t125_mc_items_criterios INNER JOIN dbo.t120_mc_items ON dbo.t125_mc_items_criterios.f125_rowid_item = dbo.t120_mc_items.f120_rowid)
    INNER JOIN dbo.t106_mc_criterios_item_mayores ON (dbo.t125_mc_items_criterios.f125_id_cia = dbo.t106_mc_criterios_item_mayores.f106_id_cia)
    AND (dbo.t125_mc_items_criterios.f125_id_criterio_mayor = dbo.t106_mc_criterios_item_mayores.f106_id) AND (dbo.t125_mc_items_criterios.f125_id_plan = dbo.t106_mc_criterios_item_mayores.f106_id_plan)
    WHERE (((dbo.t125_mc_items_criterios.f125_id_cia)=6) AND ((dbo.t125_mc_items_criterios.f125_id_plan)='SUB' Or (dbo.t125_mc_items_criterios.f125_id_plan)='CAT'))
    ORDER BY dbo.t120_mc_items.f120_id, dbo.t125_mc_items_criterios.f125_id_plan ASC;
    `
    let categoryPrincipal
    if (category.recordset.length > 0) {
      for (const object of category.recordset) {
        if (object.f125_id_plan.toString() === 'CAT') {
          categoryPrincipal = object
        } else {
          const data = {
            idCatPost: object.f106_id,
            name: object.f106_descripcion,
            description: object.f106_descripcion,
            principal: categoryPrincipal.f106_descripcion
          }
          const getCategory = await CategoryModel.get({ name: object.f106_descripcion })
          if (!getCategory._id) {
            const createCategory = await CategoryModel.create(data)
            const h = await productsForCategorySchema.create({category: createCategory._id, idPosProduct: object.f125_rowid_item})
          } else {
            const h = await productsForCategorySchema.create({category: getCategory._id, idPosProduct: object.f125_rowid_item})
          }
        }
      }
    }
    return category
  }

  async assignCategoryPos () {
    const producstForCategory = await productsForCategorySchema.search({})
    console.log(producstForCategory)
    for (const object of producstForCategory) {
      const product = await ProductModel.get({ idPos: object.idPosProduct })
      if (product._id) {
        await ProductModel.update(product._id, {category: object.category})
        productsForCategorySchema.delete({_id: object._id})
      }
    }
    return producstForCategory.length
  }

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

  async update(id, data) {
    const isExist = await CategoryModel.get(id)
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
      return { estado: false, data: [], mensaje: 'No hay categorias' }
    }
  }
}

module.exports = new Category()
