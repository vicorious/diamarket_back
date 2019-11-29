"use strict"

const SupermarketModel = require("../models/supermarketSchema")
const UserModel = require("../models/userSchema")

class Supermarket {
  async create(data) {
    const isExist = await SupermarketModel.get({ address: data.address })
    if (!isExist._id) {
      const create = await SupermarketModel.create(data)
      return { estado: true, data: create, mensaje: null }
    } else {
      return {
        estado: false,
        data: [],
        mensaje: "Ya se encuentra registrado un supermercado con esa dirección"
      }
    }
  }

<<<<<<< HEAD
    async update(id, data) {
        const isExist = await SupermarketModel.get({ _id: id })
        if (isExist._id) {
            const update = await SupermarketModel.update(isExist._id, data)
            return { estado: true, data: [], mensaje: null }
=======
  async update(id, data) {
    const isExist = await SupermarketModel.get({ _id: id })
    if (isExist) {
      if (data.images) {
        if (isExist.images.length > 0) {
          let images = data.images
          delete data.images
          await SupermarketModel.update(isExist._id, data)
          const update = SupermarketModel.update(isExist._id, {$push: {images: images}})
          return update
>>>>>>> 87537604448bcfe157e906adb6f92c28774f37b2
        } else {
          const update = await SupermarketModel.update(isExist._id, data)
          return update
        }
      } else {
        const update = await SupermarketModel.update(isExist._id, data)
        return update
      }
    } else {
      return { estado: false, data: [], mensaje: "Datos no actualizados" }
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
      const updateImage = await SupermarketModel.update(isExist._id, {
        images: image
      })
      return { estado: true, data: [], mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: "No existe el supermercado" }
    }
  }

  async  deleteImage(_id, data) {
    const isExist = await SupermarketModel.get({ _id })
    if (isExist._id) {
      const newImage = []
      for (const images of isExist.images) {
        let repeatedImages = data.images.includes(images)
        if (!repeatedImages) {
          newImage.push(images)
        }
      }
      const update = await SupermarketModel.update(_id, { images: newImage })
      return update
    } else {
      return { estado: false, data: [], mensaje: "No existe el supermercado" }
    }
  }

  async detail(data) {
    const supermarket = await SupermarketModel.get({ _id: data })
    if (supermarket._id) {
      return { estado: true, data: supermarket, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: "El supermercado no existe" }
    }
  }

<<<<<<< HEAD
    async detailImage(data) {
        const supermarket = await SupermarketModel.get({ _id: data })
        if (supermarket._id) {
            const imageandlogo = {
                images: supermarket.images,
                logo: supermarket.logo
            }
            return { estado: true, data: imageandlogo, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "El supermercado no existe" }
        }
    }

    async rateSupermarket(_id, data) {
        const isExist = await SupermarketModel.get({ _id })
        if (isExist) {
            let rateArray = []
            for (const rate of isExist.calification) {
                rateArray.push(rate)
            }
            rateArray.push(data.calification)
            const update = await SupermarketModel.update(_id, { calification: rateArray })
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "El supermercado no existe" }
        }
=======
  async rateSupermarket(_id, data) {
    const isExist = await SupermarketModel.get({ _id })
    if (isExist) {
      const update = await SupermarketModel.update(_id, {$push: {calification: data.calification}})
      return update
    } else {
      return { estado: false, data: [], mensaje: "El supermercado no existe" }
>>>>>>> 87537604448bcfe157e906adb6f92c28774f37b2
    }
  }

  async all(data) {
    const getAll = await SupermarketModel.search(data)
    if(getAll.length > 0) {
      return { estado: true, data: getAll, mensaje: null }
    }else {
      return{ estado: false, data: [], mensaje: "No existen supermercados"}
    }
    
  }

  async count() {
    const count = await SupermarketModel.count()
    return count
  }

  async countGen() {
    let countOrder = 0
    let countOrderFinish = 0
    let countOrderWait = 0
    const userCount = await UserModel.count({ rol: "client" })
    const data = await UserModel.search({ rol: "client" })
    for (const user of data) {
      for (const order of user.order) {
        if (order.uid) countOrder++
      }
    }
    for (const user of data) {
      for (const order of user.order) {
        if (order.status === "finalizada") {
          countOrderFinish++
        }
      }
    }
    for (const user of data) {
      for (const order of user.order) {
        if (order.status === "pendiente") {
          countOrderWait++
        }
      }
    }
    return { countOrder, userCount, countOrderFinish, countOrderWait }
  }

  async forMonth() {
    const date = new Date()
    const dateNow = `${date.getMonth() + 1}-${date.getFullYear()}`
    const supermarkets = await SupermarketModel.search()
    let countSupermarket = 0
    for (const supermarket of supermarkets) {
      const dateSupermarket = `${supermarket.dateCreate.getMonth() +
        1}-${supermarket.dateCreate.getFullYear()}`
      if (dateNow === dateSupermarket) {
        countSupermarket++
      }
    }
    return countSupermarket
  }
}

module.exports = new Supermarket()
