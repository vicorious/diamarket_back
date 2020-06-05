'use strict'
const CategoryModel = require('../models/categorySchema')
const ProductModel = require('../models/productSchema')
const productsForCategorySchema = require('../models/productsForCategorySchema')
const MsSql = require('mssql')
const uid = require('node-uuid')

class Category {
  async createDataPost() {
    const categorys = await MsSql.query`
    SELECT f125_rowid_item , dbo.t125_mc_items_criterios.f125_id_plan, dbo.t106_mc_criterios_item_mayores.f106_id, dbo.t106_mc_criterios_item_mayores.f106_descripcion
    FROM (dbo.t125_mc_items_criterios INNER JOIN dbo.t120_mc_items ON dbo.t125_mc_items_criterios.f125_rowid_item = dbo.t120_mc_items.f120_rowid)
    INNER JOIN dbo.t106_mc_criterios_item_mayores ON (dbo.t125_mc_items_criterios.f125_id_cia = dbo.t106_mc_criterios_item_mayores.f106_id_cia)
    AND (dbo.t125_mc_items_criterios.f125_id_criterio_mayor = dbo.t106_mc_criterios_item_mayores.f106_id) AND (dbo.t125_mc_items_criterios.f125_id_plan = dbo.t106_mc_criterios_item_mayores.f106_id_plan)
    WHERE (((dbo.t125_mc_items_criterios.f125_id_cia)=6) AND ((dbo.t125_mc_items_criterios.f125_id_plan)='SUB' Or (dbo.t125_mc_items_criterios.f125_id_plan)='CAT'))
    ORDER BY dbo.t120_mc_items.f120_id, dbo.t125_mc_items_criterios.f125_id_plan ASC;
    `
    let category
    for (const object of categorys.recordset) {
      if (object.f125_id_plan.toString().toUpperCase() === 'CAT') {
        category = await CategoryModel.get({ name: object.f106_descripcion.toString().toLowerCase() })
        if (!category._id) {
          const create = await CategoryModel.create({
            idCatPost: object.f106_id,
            name: object.f106_descripcion,
            description: object.f106_descripcion,
          })
          category = create
        }
      } else if (object.f125_id_plan.toString().toUpperCase() === 'SUB') {
        const sub = {
          _id: uid.v1(),
          name: object.f106_descripcion.toString().toLowerCase(),
          description: object.f106_descripcion.toString().toLowerCase()
        }
        if (category._id) {
          let flagSub = false
          const categoryBD = await CategoryModel.get({ _id: category._id })
          for (const item of categoryBD.subCategory) {
            if (item.name.toString().toLowerCase() === object.f106_descripcion.toString().toLowerCase()) {
              flagSub = true
              break
            } else {
              flagSub = false
            }
          }
          if (!flagSub) {
            await CategoryModel.update(category._id, { $push: { subCategory: sub } })
          }
          await productsForCategorySchema.create({
            category: categoryBD._id,
            subCategory: object.f106_descripcion.toString().toLowerCase(),
            idPosProduct: object.f125_rowid_item
          })
        }
      }
    }
    return categorys
  }

  async assignCategoryPos() {
    const producstForCategory = await productsForCategorySchema.search({})
    for (const object of producstForCategory) {
      const product = await ProductModel.get({ idPos: object.idPosProduct })
      if (product._id) {
        const category = await CategoryModel.get({ _id: object.category })
        await category.subCategory.filter(async item => {
          if (item.name === object.subCategory) {
            await ProductModel.update(product._id, { subCategory: item._id, category: category._id })
            productsForCategorySchema.delete({ _id: object._id })
          }
        })
      }
    }
    return producstForCategory.length
  }

  async migrateNamesCategory() {
    const categorys = await CategoryModel.search({})
    for (const object of categorys) {
      
    }
    return categorys
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
