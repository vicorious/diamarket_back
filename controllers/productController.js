'use strict'
const ProductModel = require('../models/productSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const PromotionModel = require('../models/promotionSchema')
const makeCode = require('../utils/makeCode')
const CategoryModel = require('../models/categorySchema')
const UserModel = require('../models/userSchema')
const SupermarketModel = require('../models/supermarketSchema')
const UserListModel = require('../models/userListSchema')

class Product {
  async create (data) {
    const isExist = await ProductModel.get({ name: data.name })
    if (!isExist._id) {
      const product = await ProductModel.create(data)
      if (product._id) {
        return { estado: true, data: product, mensaje: null }
      } else {
        return { estado: false, data: [], mensaje: 'Error al almacencar datos' }
      }
    } else {
      return { estado: false, data: [], mensaje: 'Ya existe el producto' }
    }
  }

  async update (id, data) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      const update = await ProductModel.update(id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async detail (id) {
    console.log(id)
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async all (data) {
    const products = await ProductModel.search(data)
    return { estado: true, data: products, mensaje: null }
  }

  async productsSuperMarkets (idSupermarket) {
    const products = await AvailabilityModel.search({ idSupermarket, isActive: true })
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene productos' }
    }
  }

  async productsForCategory (data) {
    const products = await ProductModel.search({ category: data.category })
    const arrayProducts = []
    for (const product of products) {
      const productsCategory = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsCategory._id) {
        arrayProducts.push(productsCategory)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Esta categoria no tiene productos' }
    }
  }

  async productsForName (data) {
    const products = await ProductModel.search({ name: data.name })
    const arrayProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe productos cor este nombre' }
    }
  }

  async createData () {
    const arrayCategorysToCreate = ['LECHES LIQUIDAS', 'ALIMENTOS', 'VIVERES Y ABARROTES', 'FRUVER', 'CARNES', 'ASEO', 'ASEO HOGAR', 'ASEO PERSONAL', 'UTILES ESCOLARES']
    for (let i = 0; i < arrayCategorysToCreate.length; i++) {
      const obj = {
        name: arrayCategorysToCreate[i],
        description: 'Descripción de la categoria',
        image: 'https://www.webconsultas.com/sites/default/files/styles/wc_adaptive_image__small/public/articulos/productos-lacteos.jpg'
      }
      await CategoryModel.create(obj)
    }
    const client = {
      name: 'Jairo Sotelo',
      identification: '1032497424',
      email: 'jairo.sotelo@gracialab.com.co',
      cellPhone: '573214253287',
      password: '123456',
      birthday: '2000-04-12',
      rol: 'client',
      isActive: true
    }
    const createClient = await UserModel.create(client)
    const superadmin = {
      name: 'Super Adminitrator',
      identification: '1032497424',
      email: 'admin@admin.com',
      cellPhone: '573214253287',
      password: 'adminadmin',
      birthday: '2000-04-12',
      rol: 'superadministrator',
      isActive: true
    }
    await UserModel.create(superadmin)
    const admin0 = {
      name: 'Administrador Carlos',
      identification: '1032497424',
      email: 'carlos@admin.com',
      cellPhone: '573214253287',
      password: '123456',
      birthday: '2000-04-12',
      rol: 'administrator',
      isActive: true
    }
    const createAdmin0 = await UserModel.create(admin0)
    const admin1 = {
      name: 'Administrador Juan',
      identification: '1032497424',
      email: 'juan@admin.com',
      cellPhone: '573214253287',
      password: '123456',
      birthday: '2000-04-12',
      rol: 'administrator',
      isActive: true
    }
    const createAdmin1 = await UserModel.create(admin1)
    const admin2 = {
      name: 'Administrador Pablo',
      identification: '1032497424',
      email: 'pablo@admin.com',
      cellPhone: '573214253287',
      password: '123456',
      birthday: '2000-04-12',
      rol: 'administrator',
      isActive: true
    }
    const createAdmin2 = await UserModel.create(admin2)
    const supermarket0 = {
      name: 'Jumbo',
      address: 'Av cll 80 N° 69Q-50, Bogotá, Cundinamarca',
      location: {
        type: 'Point',
        coordinates: [4.6564946, -74.091515]
      },
      neigborhood: 'Engativa calle 80',
      locality: 'Engativa',
      email: 'jumbo@jumbo.com',
      logo: 'https://www.braindw.com/wp-content/uploads/2017/08/logo-jumbo.png',
      images: ['https://www.braindw.com/wp-content/uploads/2017/08/logo-jumbo.png'],
      idAdmin: createAdmin0._id,
      schedules: [{
        schedulesInit: '0',
        schedulesFinish: '7',
        hourInit: '7:00 A.M.',
        hourFinish: '9:00 P.M.'
      }],
      supermarketType: 'Supermarket'
    }
    const createSupermarket0 = await SupermarketModel.create(supermarket0)
    console.log(createSupermarket0)
    const supermarket1 = {
      name: 'Ara',
      address: 'Cl 127 #60-39, Bogotá, Cundinamarca',
      location: {
        type: 'Point',
        coordinates: [4.711351, -74.073055]
      },
      neigborhood: 'Niza Calle 127',
      locality: 'Niza',
      email: 'ara@ara.com',
      logo: 'https://seeklogo.com/images/T/tiendas-ara-logo-CE2211ACBF-seeklogo.com.png',
      images: ['https://seeklogo.com/images/T/tiendas-ara-logo-CE2211ACBF-seeklogo.com.png'],
      idAdmin: createAdmin1._id,
      schedules: [{
        schedulesInit: '0',
        schedulesFinish: '7',
        hourInit: '7:00 A.M.',
        hourFinish: '9:00 P.M.'
      }],
      supermarketType: 'Supermarket'
    }
    const createSupermarket1 = await SupermarketModel.create(supermarket1)
    const supermarket2 = {
      name: 'Exito',
      address: 'Cl. 79 #15 - 46, Bogotá, Cundinamarca',
      location: {
        type: 'Point',
        coordinates: [4.6504042, -74.0965834]
      },
      neigborhood: 'Barrios Unidos',
      locality: 'Teusaquillo',
      email: 'exito@exito.com',
      logo: 'https://www.parquearboleda.com/wp-content/uploads/2018/11/exito.png',
      images: ['https://www.parquearboleda.com/wp-content/uploads/2018/11/exito.png'],
      idAdmin: createAdmin2._id,
      schedules: [{
        schedulesInit: '0',
        schedulesFinish: '7',
        hourInit: '7:00 A.M.',
        hourFinish: '9:00 P.M.'
      }],
      supermarketType: 'Supermarket'
    }
    const createSupermarket2 = await SupermarketModel.create(supermarket2)
    const arrayProductsName = ['Leche', 'Arroz', 'Maizena', 'Café soluble', 'Frijol', 'Sopa', 'Huevos', 'Consomate', 'Harina de trigo', 'Azúcar', 'Aceite', 'Manteca vegetal', 'Papa blanca', 'Jitomate', 'Pierna y muslo de pollo', 'Chile verde', 'Cebollas', 'Detergente', 'Jabón de baño', 'Papel de baño', 'Cloro', 'Shampoo', 'Naranjas', 'Plátanos', 'Limones', 'Tortillas de maíz', 'Pasta de dientes', 'Jamón', 'Carne molida', 'Cereal', 'Manzanas', 'Aguacate', 'Huevos', 'Papa', 'Utiles escolares', 'Jabón líquido p/trastes', 'Spaguetti', 'Chocolate', 'Fabuloso', 'Lentejas', 'Café', 'Brillaollas', 'Ambientador', 'Yogurt descremado', 'Pan', 'Desodorante', 'Tampones', 'Toallas higiénicas', 'Suavizante para la ropa', 'Dulce de leche tradicional']
    const arrayCategorys = ['LECHES LIQUIDAS', 'ALIMENTOS', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ALIMENTOS', 'ALIMENTOS', 'ALIMENTOS', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'FRUVER', 'FRUVER', 'CARNES', 'FRUVER', 'FRUVER', 'ASEO', 'ASEO', 'ASEO HOGAR', 'ASEO HOGAR', 'ASEO', 'FRUVER', 'FRUVER', 'FRUVER', 'VIVERES Y ABARROTES', 'ASEO PERSONAL', 'CARNES', 'CARNES', 'ALIMENTOS', 'FRUVER', 'FRUVER', 'ALIMENTOS', 'FRUVER', 'UTILES ESCOLARES', 'ASEO', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ASEO HOGAR', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ASEO HOGAR', 'ASEO HOGAR', 'ALIMENTOS', 'ALIMENTOS', 'ASEO PERSONAL', 'ASEO PERSONAL', 'ASEO PERSONAL', 'ASEO HOGAR', 'VIVERES Y ABARROTES']
    const arrayCategorysID = []
    const arrayProductsID = []
    for (let i = 0; i < arrayCategorys.length; i++) {
      const getId = await CategoryModel.get({ name: arrayCategorys[i] })
      arrayCategorysID.push(getId._id)
    }
    for (let i = 0; i <= 49; i++) {
      const random = await makeCode()
      const random1 = await makeCode()
      const obj = {
        image: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRboqluVJCwYkst2vdSyHoETJosgD-J-igSAKNaqBdjU8m88Ki9NxqQZg2YjtYnUYz84RD2GUDebqHeY82aYeLjTvLCtWZNukMhIfgLrE3guyKUOhw3BfvGJA&usqp=CAc'],
        idPos: random,
        name: arrayProductsName[i],
        description: `Descripción del producto ${arrayProductsName[i]}`,
        category: arrayCategorysID[i],
        defaultprice: '12000'
      }
      const create = await ProductModel.create(obj)
      const data0 = {
        idSupermarket: createSupermarket0._id,
        idProduct: create._id,
        quantity: random1,
        price: '12000'
      }
      await AvailabilityModel.create(data0)
      const data1 = {
        idSupermarket: createSupermarket1._id,
        idProduct: create._id,
        quantity: random1,
        price: '12000'
      }
      await AvailabilityModel.create(data1)
      const data2 = {
        idSupermarket: createSupermarket2._id,
        idProduct: create._id,
        quantity: random1,
        price: '12000'
      }
      await AvailabilityModel.create(data2)
      arrayProductsID.push(create._id)
    }
    for (let r = 0; r <= 20; r++) {
      const name0 = arrayProductsName[r]
      const name1 = arrayProductsName[r + 1]
      const id0 = arrayProductsID[r]
      const id1 = arrayProductsID[r + 1]
      const obj = {
        products: [id0, id1],
        image: ['https://www.creaciondevalorcompartido.cl/images/nestle-chile/marcas-y-productos.png'],
        name: `Promoción de ${name0} y ${name1}!`,
        supermarket: createSupermarket0._id,
        value: 132000
      }
      await PromotionModel.create(obj)
      const obj1 = {
        products: [id0, id1],
        user: createClient._id,
        name: `Listado para comprar ${name0} y ${name1}!`,
        supermarket: createSupermarket0._id
      }
      await UserListModel.create(obj1)
    }
    for (let r = 0; r <= 20; r++) {
      const name0 = arrayProductsName[r]
      const name1 = arrayProductsName[r + 1]
      const id0 = arrayProductsID[r]
      const id1 = arrayProductsID[r + 1]
      const obj = {
        products: [id0, id1],
        image: ['https://www.creaciondevalorcompartido.cl/images/nestle-chile/marcas-y-productos.png'],
        name: `Promoción de ${name0} y ${name1}!`,
        supermarket: createSupermarket1._id,
        value: 132000
      }
      await PromotionModel.create(obj)
      const obj1 = {
        products: [id0, id1],
        user: createClient._id,
        name: `Listado para comprar ${name0} y ${name1}!`,
        supermarket: createSupermarket1._id
      }
      await UserListModel.create(obj1)
    }
    for (let r = 0; r <= 20; r++) {
      const name0 = arrayProductsName[r]
      const name1 = arrayProductsName[r + 1]
      const id0 = arrayProductsID[r]
      const id1 = arrayProductsID[r + 1]
      const obj = {
        products: [id0, id1],
        image: ['https://www.creaciondevalorcompartido.cl/images/nestle-chile/marcas-y-productos.png'],
        name: `Promoción de ${name0} y ${name1}!`,
        supermarket: createSupermarket2._id,
        value: 132000
      }
      await PromotionModel.create(obj)
      const obj1 = {
        products: [id0, id1],
        user: createClient._id,
        name: `Listado para comprar ${name0} y ${name1}!`,
        supermarket: createSupermarket2._id
      }
      await UserListModel.create(obj1)
    }
    return 'Successful!!!'
  }

//   async categoryData () {
//     try {
//       const categorys = await categoryModel.search({})
//       let count = 0
//       for (let r = 0; r <= 20; r++) {
//         for (const category of categorys) {
//           count++
//           const random = await generalController.createCode()
//           const obj = {
//             image: ['https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3323070-750-750/7702129075275-1.jpg?v=636670897146530000'],
//             idPos: random,
//             name: `Jamón${count}`,
//             description: 'Descripción de el producto',
//             category: category.name,
//             defaultprice: 12300
//           }
//           const create = await ProductModel.create(obj)
//           console.log(create)
//         }
//       }
//       return 'Successful!'
//     } catch (error) {
//       console.log(error)
//       return 'Failure!'
//     }
//   }
}

module.exports = new Product()
