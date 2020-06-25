'use strict'
const UserModel = require('../models/userSchema')
const {sendSms} = require('../utils/makeSms')
const makeCode = require('../utils/makeCode')
const makePassword = require('../utils/makePassword')
const AuthController = require('../controllers/authController')
const EmailController = require('./emailController')
const OrderSchema = require('../models/orderServiceSchema')
const SuperMarketSchema = require('../models/supermarketSchema')
const MakeObjectToken = require('../utils/makeObjectToken')
const MakeDeleteObjectToken = require('../utils/makeDeleteObjectToken')
const MakeDataPayU = require('../utils/makeDataPayU')
const axios = require('axios')
const uuid = require('node-uuid')
const secret = 'vmKeS%O!w!%zmVydx5e*t8k%zDIAMARKET#boaTOKEN*h^l^4sYzCARD$xtGYcpT!j5IP8g#5QJrZ4zyUP26ewqIDU90!Z^D2Tzr%0*LH6AXUORtKskMO'
const crypto = require('crypto')

class User {
    async create(data) {
        const isExists = await UserModel.get({email: data.email})
        data.verifyCode = await makeCode()
        if (!isExists._id) {
            switch (data.rol) {
                case 'domiciliary': {
                    if (data.workingSupermarket) {
                        data.isActive = true
                        const user = await UserModel.create(data)
                        return {estado: true, data: user, mensaje: null}
                    } else {
                        const supermarket = await SuperMarketSchema.get({idAdmin: data.idAdmin})
                        data.workingSupermarket = supermarket._id
                        data.isActive = true
                        const user = await UserModel.create(data)
                        return {estado: true, data: user, mensaje: null}
                    }
                }

                case 'administrator': {
                    const supermarket = await SuperMarketSchema.get({_id: data.supermarket})
                    data.isActive = true
                    const user = await UserModel.create(data)
                    await SuperMarketSchema.update(supermarket._id, {idAdmin: user._id})
                    return {estado: true, data: user, mensaje: null}
                }

                case 'superadministrador': {
                    data.isActive = true
                    const user = await UserModel.create(data)
                    return {estado: true, data: user, mensaje: null}
                }

                case 'client': {
                    const user = await UserModel.create(data)
                    if (user._id) {
                        await sendSms(data.cellPhone, data.verifyCode)
                        return {estado: true, data: user, mensaje: null}
                    } else {
                        return {estado: false, data: [], mensaje: 'Error al almacenar los datos'}
                    }
                }

                default: {
                    return {estado: false, data: [], mensaje: 'El rol no existe'}
                }
            }
        } else {
            return {estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema'}
        }
    }

    async createSocial(data) {
        const isExist = await UserModel.get({email: data.email})
        if (!isExist._id) {
            const password = await makeCode()
            data.password = password
            data.identification = data.id
            data.cellphone = '123456789'
            data.rol = 'client'
            data.isActive = true
            delete data.id
            const create = await UserModel.create(data)
            const user = await UserModel.get({_id: create._id})
            const auth = await AuthController.createTokenUser(user)
            return auth
        } else {
            return {estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema'}
        }
    }

    async validate(data) {
        const isExist = await UserModel.get({email: data.email, verifyCode: data.code})
        if (isExist._id) {
            const code = await makeCode()
            await UserModel.update(isExist._id, {isActive: true, verifyCode: code})
            const userToken = await AuthController.createTokenUser(isExist)
            return userToken
        } else {
            return {estado: false, data: [], mensaje: 'El código de autencticación no es valido'}
        }
    }

    async sendCode(data) {
        const user = await UserModel.get({cellPhone: data.cellPhone})
        if (user._id) {
            const code = await makeCode()
            await sendSms(data.cellPhone, 'Bienvenido DiaMarket tu codigo de restauracion es ' + code)
            await UserModel.update(user._id, {verifyCode: code})
            return {estado: true, data: {message: 'El sms fue enviado', mensaje: null}}
        } else {
            return {estado: false, data: [], mensaje: 'El usuario no existe'}
        }
    }

    async sendEmailPassword(email) {
        const code = await makeCode()
        const isExist = await UserModel.get({email})
        if (isExist._id) {
            await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
            const update = await UserModel.update(isExist._id, {verifyCode: code})
            return update
        } else {
            return {estado: false, data: [], mensaje: 'No se ha actualizado el código de recuperación'}
        }
    }

    async updatePassword(data) {
        const codeRandom = await makeCode()
        const user = await UserModel.get({verifyCode: data.code})
        if (user._id) {
            const passwordCrypt = await makePassword(data.password)
            console.log(passwordCrypt)
            const update = await UserModel.update(user._id, {password: passwordCrypt, verifyCode: codeRandom})
            return update
        } else {
            return {estado: false, data: [], mensaje: 'El código  no coincide'}
        }
    }

    async update(id, data) {
        const isExist = await UserModel.get({_id: id})
        if (data.password) {
            const encriptar = await makePassword(data.password)
            data.password = encriptar
        }
        if (isExist._id) {
            const update = await UserModel.update(id, data)
            return update
        } else {
            return {estado: false, data: [], mensaje: 'El usuario no ha sido actualizado'}
        }
    }

    async createDirection(_id, data) {
        const isExist = await UserModel.get(_id)
        data.uid = uuid.v4()
        if (isExist._id) {
            if (isExist.directions.length > 0) {
                const update = await UserModel.update(_id, {$push: {directions: data}})
                return update
            } else {
                const update = await UserModel.update(_id, {directions: data})
                return update
            }
        } else {
            return {estado: false, data: [], mensaje: 'El usuario no existe'}
        }
    }

    async detail(id) {
        const user = await UserModel.get(id)
        if (user._id) {
            if (user.rol === 'administrator') {
                const supermarket = await SuperMarketSchema.get({idAdmin: user._id})
                if (supermarket._id) {
                    user._doc.superMarket = supermarket
                } else {
                    user._doc.superMarket = 'No asignado'
                }
                return {estado: true, data: user, mensaje: null}
            } else {
                return {estado: true, data: user, mensaje: null}
            }
        } else {
            return {estado: false, data: [], mensaje: 'El usuario no se encuentra registrado'}
        }
    }

    async allPage(data, quantity, page) {
        UserModel.perPage = parseInt(quantity)
        const users = await UserModel.searchByPage(data, page)
        const countUsers = await UserModel.count(data)
        if (users.length > 0) {
            return {
                estado: true,
                data: {page: page, quantity: quantity, total: countUsers, items: users},
                mensaje: null
            }
        } else {
            return {estado: false, data: [], mensaje: 'No se encuentran datos'}
        }
    }

    async all(data) {
        const user = await UserModel.search(data)
        if (user.length > 0) {
            return {estado: true, data: user, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'No se encuentran datos'}
        }
    }

    async clientSupermarket(_id) {
        const orders = await OrderSchema.search({superMarket: _id})
        const clients = []
        if (orders.length > 0) {
            for (const order of orders) {
                if (clients.length > 0) {
                    for (const client of clients) {
                        if (client.user !== order.user) {
                            client.push(order)
                        }
                    }
                } else {
                    clients.push(order)
                }
            }
        } else {
            return {estado: true, data: [], mensaje: 'Este supermercado no tiene clientes'}
        }
    }

    async administratorsWithoutSupermarket() {
        const users = await UserModel.search({rol: 'administrator'})
        const supermarkets = await SuperMarketSchema.search({idAdmin: {$exists: true}})
        let administrators = []
        if (supermarkets.length > 0) {
            for (const user of users) {
                let flagSupermarket = false
                for (const item of supermarkets) {
                    if (item.idAdmin._id.toString() === user._id.toString()) {
                        flagSupermarket = true
                    }
                }
                if (!flagSupermarket) {
                    administrators.push(user)
                }
            }
        } else {
            administrators = users
        }
        if (administrators.length > 0) {
            return {estado: true, data: administrators, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'No hay administradores disponibles para asignar'}
        }
    }

    async clientsForSuperMarket(supermarket) {
        const users = await UserModel.search({supermarketFavorite: supermarket})
        if (users.length > 0) {
            return {estado: true, data: users, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'No hay clientes en este supermercado'}
        }
    }

    async domiciliaryForSuperMarket(_id) {
        const supermarket = await SuperMarketSchema.get({idAdmin: _id})
        const users = await UserModel.search({workingSupermarket: supermarket._id})
        if (users.length > 0) {
            return {estado: true, data: users, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'Este supermercado no tiene domiciliarios'}
        }
    }

    async countClientsForSuperMarket(supermarket) {
        const orders = await OrderSchema.search({superMarket: supermarket})
        const clients = []
        if (orders.length > 0) {
            for (const order of orders) {
                if (clients.length > 0) {
                    for (const client of clients) {
                        if (client.toString() !== order.user._id.toString()) {
                            clients.push(order.user._id)
                        }
                    }
                } else {
                    clients.push(order.user._id)
                }
            }
        }
        return clients.length
    }

    async createCard(data) {
        const user = await UserModel.get({_id: data._id})
        const objectToken = MakeObjectToken(data)
        const response = await axios.post(MakeDataPayU.urlFinal, objectToken)
        const cardsUser = user.cards
        if (response.data.code === 'SUCCESS') {

            if (cardsUser.length > 0) {
                let newCards = []
                for (const card of user.cards) {
                    //ESTRUCTURA
                    let cardNew = {
                        uid: card.uid,
                        number: card.number,
                        token: card.token,
                        name: card.name,
                        identification: card.identification,
                        type: card.type,
                        securityCode: card.securityCode,
                        expirationDate: card.expirationDate,
                        default: false,
                    }
                    newCards.push(cardNew)
                }
                const response = await UserModel.update({_id: data._id}, {cards: newCards})
            }

            const cardId = uuid.v4()
            const card = {
                uid: cardId,
                number: response.data.creditCardToken.maskedNumber,
                token: crypto.createCipher('aes-256-ctr', secret).update(response.data.creditCardToken.creditCardTokenId, 'utf8', 'hex'),
                name: response.data.creditCardToken.name,
                identification: response.data.creditCardToken.identificationNumber,
                type: response.data.creditCardToken.paymentMethod,
                securityCode: crypto.createCipher('aes-256-ctr', secret).update(data.securityCode.toString(), 'utf8', 'hex'),
                expirationDate: data.expirationDate,
                default: true
            }
            const cardUser = user.cards.find(element => element.token === card.token)
            if (cardUser !== undefined) {
                return {estado: false, data: [], mensaje: 'La tarjeta ya se encuentra registrada'}
            } else {
                await UserModel.update(user._id, {$push: {cards: card}})
                return {estado: true, data: {uid: cardId}, mensaje: null}
            }
        } else {
            return {estado: false, data: [], mensaje: 'No se pudo registrar la tarjeta, por favor vuelva a intentarlo'}
        }
    }

    async updateDefaultCard(_id, data) {
        const user = await UserModel.get({_id})
        let newCards = []
        for (const card of user.cards) {
            //ESTRUCTURA
            let cardNew = {
                uid: card.uid,
                number: card.number,
                token: card.token,
                name: card.name,
                identification: card.identification,
                type: card.type,
                securityCode: card.securityCode,
                default: card.default
            }
            data.cardId === card.uid ? cardNew.default = true : cardNew.default = false
            newCards.push(cardNew)
        }
        const response = await UserModel.update(_id, {cards: newCards})
        if (response.data.update) {
            return {estado: true, data: [], mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'Ocurrio un error'}
        }
    }


    async listCardDefault(_id) {
        const user = await UserModel.get(_id)
        if (user.cards.length > 0) {
            for (const card of user.cards) {
                if (card.default === true) {
                    return {estado: true, data: card, mensaje: null}
                }
            }
        } else {
            return {estado: false, data: [], mensaje: 'No tiene tarjetas registradas'}
        }
    }

    async listCards(_id) {
        const user = await UserModel.get(_id)
        if (user.cards.length > 0) {
            let cards = []
            for (const card of user.cards) {
                cards.push({
                    uid: card.uid,
                    number: card.number,
                    name: card.name,
                    type: card.type,
                    expirationDate: card.expirationDate,
                    default: card.default
                })
            }
            return {estado: true, data: cards, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'No tiene tarjetas registradas'}
        }
    }

    async detailCard(_id, uid) {
        const user = await UserModel.get({_id})
        const card = user.cards.find(element => element.uid === uid)
        if (card !== undefined) {
            return {
                estado: true,
                data: {
                    uid: card.uid,
                    number: card.number,
                    name: card.name,
                    type: card.type,
                    default: card.default,
                    expirationDate: card.expirationDate
                },
                mensaje: null
            }
        } else {
            return {estado: false, data: [], mensaje: 'Esta tarjeta no se encuentra'}
        }
    }

    async deleteCard(_id, uid) {
        const user = await UserModel.get({_id})
        let card = {}
        for (const key in user.cards) {
            if (user.cards[key].uid === uid) {
                card = user.cards[key]
                user._doc.cards.splice(key, 1)
            }
        }
        if (card.uid) {
            const token = crypto.createDecipher('aes-256-ctr', secret).update(card.token, 'hex', 'utf8')
            const objectDeleteToken = MakeDeleteObjectToken(_id, token)
            await axios.post(MakeDataPayU.urlFinal, objectDeleteToken)
            await UserModel.update(user._id, {cards: user.cards})
            return {estado: false, data: true, mensaje: null}
        } else {
            return {estado: false, data: [], mensaje: 'Esta tarjeta no se encuentra'}
        }
    }

    async updateToken(_id, data) {
        const user = await UserModel.get(_id)
        console.log(data)
        if (user._id) {
            await UserModel.update(user._id, data)
        } else {
            return {estado: false, data: [], message: 'Este usuario no se encuentra'}
        }
    }

    async deleteForId(uid, _id) {
        const user = await UserModel.get(_id)
        if (user._id) {
            let newAddress = []
            for (const direction of user.directions) {
                if (uid != direction.uid) {
                    newAddress.push(direction)
                }
            }
            await UserModel.update(user._id, {directions: newAddress})
            return {estado: true, data: [], message: 'Datos actualizados correctamente'}
        } else {
            return {estado: false, data: [], message: 'Este usuario no se encuentra'}
        }
    }
}

module.exports = new User()
