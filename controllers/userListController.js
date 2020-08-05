'use strict'
const UserListModel = require('../models/userListSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const CategoryModel = require('../models/categorySchema')

class UserList {
    async create(data) {
        const isExist = await UserListModel.get({ name: data.name })
        if (!isExist._id) {
            const list = await UserListModel.create(data)
            return { estado: true, data: list, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'Ya existe una lista con este nombre' }
        }
    }

    async update(_id, data) {
        const isExist = await UserListModel.get({ _id })
        let products = []
        if (isExist._id) {
            for (const product of isExist.products) {
                if (product._id.toString() === data.products) {
                    return { estado: false, data: [], mensaje: "El producto ya se encuentra registrado " }
                } else {
                    products.push(product._id)
                }
            }
            let newData = { name: data.name, supermarket: data.supermarket, products: [] }
            products.push(data.products)
            newData.products = products
            const update = await UserListModel.update(isExist._id, newData)
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No exite la lista de usuario' }
        }
    }

    async deleteForId(_id, productId) {
        const isExist = await UserListModel.get({ _id })
        if (isExist._id) {
            let newProducts = []
            for (const product of isExist.products) {
                if (product._id != productId) {
                    newProducts.push(product)
                }
            }
            const update = await UserListModel.update(isExist._id, { products: newProducts })
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No exite la lista de usuario' }
        }
    }

    async detail(_id) {
        const data = await UserListModel.get(_id)
        let integer = 0
        for (const list of data.products) {
            const product = await AvailabilityModel.get({ idProduct: list })
            data.products[integer].defaultPrice = product.price
        }
        if (data._id) {
            return { estado: true, data, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No existe la lista de usuario' }
        }
    }

    // async all(user) {
    //     const list = await UserListModel.search(user)
    //     list.map(async (item) => {
    //         let calification = 0
    //         if (item.supermarket.calification.length === 0 ) {
    //             item.supermarket.calification.forEach(element => calification += element)
    //             item.supermarket._doc.calification = calification === 0 ? 0 : calification
    //         }
    //         return item
    //     })
    //     for (const object of list) {
    //         const p = object.products.map(item => {
    //           return AvailabilityModel.get({idProduct: item._id,idSupermarket: object.supermarket._id}) 
    //         })

    //         console.log(p)
    //     }
    //     return list
    // }
    async all(user) {
        let list = await UserListModel.search(user)
        let newList = []
        for (const data of list) {
          let newProducts = []
            let estructureList = {
                _id: data._id,
                name: data.name,
                supermarket: data.supermarket,
                products: data.products,
                user: data.user
            }
            for(const product of data.products){
              const data = await AvailabilityModel.get({idProduct: product._id,idSupermarket:estructureList.supermarket._id})
              const category = await CategoryModel.get({ _id: data.idProduct.category })
              data.idProduct._doc.category =  category 
              data.idProduct._doc.price = data.price
              data.idProduct._doc.quantity = data.quantity
              delete data.idProduct._doc.category._doc.subCategory
              delete data._doc.price
              delete data._doc.quantity
              let calification = 0
              console.log(data.idSupermarket)
              for (const element of data.idSupermarket.calification) {
                  calification += element
              }
              data.idSupermarket._doc.calification = calification === 0 ? 0 : calification
              newProducts.push(data)
            }
            estructureList.products=newProducts
            let estructureSupermarket = {
                _id: data.supermarket._id,
                status: data.supermarket.status,
                name: data.supermarket.name,
                address: data.supermarket.address,
                calification: 0,
                location: data.supermarket.location,
                neigborhood: data.supermarket.neigborhood,
                cellPhone: data.supermarket.cellPhone,
                locality: data.supermarket.locality,
                email: data.supermarket.email,
                logo: data.supermarket.logo,
                images: data.supermarket.images,
                isActive: data.supermarket.isActive,
                idAdmin: data.supermarket.idAdmin,
                schedules: data.supermarket.schedules,
                dateCreate: data.supermarket.dateCreate
            }
            estructureList.supermarket = estructureSupermarket
            newList.push(estructureList)
        }
        if (newList.length > 0) {
            return {estado: true, data: newList, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'No se encuentran listas creadas'}
        }
    }

    async delete(_id) {
        const list = await UserListModel.get(_id)
        if (list._id) {
            return UserListModel.delete(list._id)
        } else {
            return { estado: false, data: [], mensaje: 'No se encuentra la lista a borrar' }
        }
    }
}

module.exports = new UserList()
