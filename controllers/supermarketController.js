'use strict'
const SupermarketModel = require('../models/supermarketSchema')
const MsSql = require('mssql')

class Supermarket {
  async createDataPos () {
    const supermarkets = await MsSql.query`
    SELECT dbo.t285_co_centro_op.f285_id, dbo.t285_co_centro_op.f285_descripcion, dbo.t015_mm_contactos.f015_direccion1, dbo.t015_mm_contactos.f015_id_depto, dbo.t015_mm_contactos.f015_id_ciudad, dbo.t015_mm_contactos.f015_id_barrio, dbo.t015_mm_contactos.f015_telefono
    FROM dbo.t285_co_centro_op INNER JOIN dbo.t015_mm_contactos ON dbo.t285_co_centro_op.f285_rowid_contacto = dbo.t015_mm_contactos.f015_rowid
    WHERE (((dbo.t285_co_centro_op.f285_id)<>'001' And (dbo.t285_co_centro_op.f285_id)<>'002') AND ((dbo.t285_co_centro_op.f285_id_cia)=6) AND ((dbo.t285_co_centro_op.f285_ind_estado)=1));
    `
    for (const object of supermarkets.recordset) {
      const data = {
        supermarketIdPos: object.f285_id,
        name: object.f285_descripcion,
        address: object.f015_direccion1,
        neigborhood: object.f015_id_barrio,
        locality: object.f015_id_barrio,
        cellPhone: object.f015_telefono,
        idPos: object.f285_id
      }
      await SupermarketModel.create(data)
    }
    return supermarkets
  }

  async create (data) {
    const isExist = await SupermarketModel.get({ address: data.address })
    if (!isExist._id) {
      const create = await SupermarketModel.create(data)
      return { estado: true, data: create, mensaje: null }
    } else {
      return {
        estado: false,
        data: [],
        mensaje: 'Ya se encuentra registrado un supermercado con esa dirección'
      }
    }
  }

  async update (id, data) {
    const isExist = await SupermarketModel.get(id)
    if (isExist._id) {
      if (data.images) {
        if (isExist.images.length > 0) {
          const update = SupermarketModel.update(isExist._id, { $push: { images: data.images } })
          await SupermarketModel.update(isExist._id, data)
          return update
        } else {
          const update = await SupermarketModel.update(isExist._id, data)
          return update
        }
      } else {
        const update = await SupermarketModel.update(isExist._id, data)
        return update
      }
    } else {
      return { estado: false, data: [], mensaje: 'Datos no actualizados' }
    }
  }

  async detail (id) {
    const supermarket = await SupermarketModel.get(id)
    if (supermarket._id) {
      return { estado: true, data: supermarket, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'El supermercado no existe' }
    }
  }

  async rateSupermarket (_id, data) {
    const isExist = await SupermarketModel.get(_id)
    if (isExist._id) {
      const update = await SupermarketModel.update(isExist._id, { $push: { calification: data.calification } })
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El supermercado no existe' }
    }
  }

  async all () {
    const all = await SupermarketModel.search({})
    if (all.length > 0) {
      return { estado: true, data: all, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen supermercados' }
    }
  }

  async countSuperMarket () {
    const count = await SupermarketModel.count()
    return count
  }

  async countSuperMarketForMonth () {
    const date = new Date()
    const dateNow = `${date.getMonth() + 1}-${date.getFullYear()}`
    const supermarkets = await SupermarketModel.search({})
    const superMarketsFilter = await supermarkets.filter(obj => dateNow === `${obj.dateCreate.getMonth() + 1}-${obj.dateCreate.getFullYear()}`)
    return superMarketsFilter.length
  }

  async marketWithOutAdministrator () {
    const supermarkets = await SupermarketModel.search({ idAdmin: { $exists: false } })
    if (supermarkets.length > 0) {
      return { estado: true, data: supermarkets, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay supermercados disponibles para asignar' }
    }
  }

  async searchSuperMarketForGeoLocation (data) {
    const supermarkets = await SupermarketModel.search({ location: { $nearSphere: { $geometry: { type: 'Point', coordinates: [ parseFloat(data.latitude), parseFloat(data.length) ] }, $maxDistance: 400 } } })
    if (supermarkets.length > 0) {
      return { estado: true, data: supermarkets, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay supermercados disponibles cerca de ti' }
    } 
  }
}

module.exports = new Supermarket()
