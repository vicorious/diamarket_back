'use strict'
const CategoryModel = require('../models/categorySchema')
const MsSql = require('mssql')

class Category {
  async createDataPost () {
    const category = await MsSql.query`
    SELECT dbo.t105_mc_criterios_item_planes.f105_id, dbo.t105_mc_criterios_item_planes.f105_descripcion, dbo.t106_mc_criterios_item_mayores.f106_id, dbo.t106_mc_criterios_item_mayores.f106_descripcion
    FROM dbo.t105_mc_criterios_item_planes INNER JOIN dbo.t106_mc_criterios_item_mayores ON (dbo.t105_mc_criterios_item_planes.f105_id = dbo.t106_mc_criterios_item_mayores.f106_id_plan) AND (dbo.t105_mc_criterios_item_planes.f105_id_cia = dbo.t106_mc_criterios_item_mayores.f106_id_cia)
    WHERE (((dbo.t105_mc_criterios_item_planes.f105_id_cia)=6) AND ((dbo.t105_mc_criterios_item_planes.f105_id)='TIP' Or (dbo.t105_mc_criterios_item_planes.f105_id)='CAT'))
    ORDER BY dbo.t105_mc_criterios_item_planes.f105_id DESC;
    `
    for (const object of category.recordset) {
      switch (object.f106_descripcion) {
        case 'ANCHETA NAVIDAD': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'recomendados', description: 'Anchetas de navidad' })
          break
        }

        case 'BEBIDAS ALCOHOLICAS': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'licores', description: 'Licores' })
          break
        }

        case 'ALIMENTOS PARA MASCOTAS': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'mascotas', description: 'mascotas' })
          break
        }

        case 'CONGELADOS - REFRIGERADOS': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'congelados', description: 'congelados' })
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'despensa', description: 'despensa' })
          break
        }

        case 'BEBIDAS NO ALCOHOLICAS': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'bebidas', description: 'bebidas' })
          break
        }

        case 'ASEO PERSONAL': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'productos de uso', description: 'productos de uso' })
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'aseo personal', description: 'aseo personal' })
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'aseo hogar', description: 'aseo personal' })
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'bebes', description: 'bebes' })
          break
        }

        case 'CARNES': {
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'carne, pollo, cerdo, pescado', description: 'carne, pollo, cerdo, pescado' })
          await CategoryModel.create({ idCatPost: object.f105_id, name: 'carnes frias y embutidos', description: 'carnes frias y embutidos' })
          break
        }

        case 'ALIMENTOS': {
          break
        }

        case 'PRODUCTOS DE USO': {
          break
        }

        case 'ASEO': {
          break
        }

        case 'LECHES LIQUIDAS': {
          break
        }

        case 'CARNES FRESCAS': {
          break
        }

        default: {
          await CategoryModel.create({ idCatPost: object.f105_id, name: object.f106_descripcion, description: object.f106_descripcion })
          break
        }
      }
    }
  }

  async create (data) {
    const isExist = await CategoryModel.get({ name: data.name })
    if (!isExist._id) {
      const create = await CategoryModel.create(data)
      return { estado: true, data: create, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'La categoria ya existe' }
    }
  }

  async detail (_id) {
    const isExist = await CategoryModel.get({ _id, isActive: true })
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe la categoria' }
    }
  }

  async update (id, data) {
    const isExist = await CategoryModel.get(id)
    if (isExist) {
      const update = await CategoryModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No se ha actualizado' }
    }
  }

  async all () {
    const getAll = await CategoryModel.search({ isActive: true })
    if (getAll.length > 0) {
      return { estado: true, data: getAll, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay categorias' }
    }
  }
}

module.exports = new Category()
