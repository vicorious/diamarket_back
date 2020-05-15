'use strict'
const MakeUrlPayU = require('../utils/makeUrlPayU')
const axios = require('axios')
const MakeObjectPayment = require('../utils/makeObjectPayment')
const ValidateResponsePayment = require('../utils/validateResponsePayment')
const MakeObjectToken = require('../utils/makeObjectToken')
const UserSchema = require('../models/userSchema')
const secret = 'vmKeS%O!w!%zmVydx5e*t8k%zDIAMARKET#boaTOKEN*h^l^4sYzCARD$xtGYcpT!j5IP8g#5QJrZ4zyUP26ewqIDU90!Z^D2Tzr%0*LH6AXUORtKskMO'
const crypto = require('crypto')
const uid = require('node-uuid')

class PayU {
  async payCredit(data) {
    data.card.token = crypto.createDecipher('aes-256-ctr', secret).update(data.card.token, 'hex', 'utf8')
    data.card.securityCode = crypto.createDecipher('aes-256-ctr', secret).update(data.card.securityCode, 'hex', 'utf8')
    const objectPayment = MakeObjectPayment(data)
    const response = await axios.post(MakeUrlPayU, objectPayment)
    console.log("-------------------------------")
    console.log(objectPayment)
    console.log(response.data)
    console.log("-------------------------------")
    if (response.data.code === 'SUCCESS') {
      switch (response.data.transactionResponse.state) {
        case 'APPROVED': {
          return {status: 'APPROVED'}
        }
        case 'DECLINED': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return validateResponse
        }

        case 'ERROR': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return validateResponse
        }

        case 'EXPIRED': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return validateResponse
        }

        case 'PENDING': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return { validateResponse, status: 'PENDING' }
        }
        
        case 'CANCELLED': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return validateResponse
        }

        default: {
          return { estado: false, data: [], mensaje: 'Ocurrió un error general.', status: 'ERROR' }
        }
      }
    } else {
      return { estado: false, data: [], mensaje: 'Ocurrió un error general.', status: 'ERROR'}
    }
  }

  async payCash() { }

  async payDebit() { }

  async tokenPayU (data) {
    const objectToken = MakeObjectToken(data)
    const response = await axios.post(MakeUrlPayU, objectToken)
    if (response.data.code !== 'ERROR') {
      response.data.creditCardToken.creditCardTokenId = crypto.createCipher('aes-256-ctr', secret).update(response.data.creditCardToken.creditCardTokenId, 'utf8', 'hex')
      response.data.creditCardToken.securityCode = crypto.createCipher('aes-256-ctr', secret).update(data.securityCode, 'utf8', 'hex')
      const user = await UserSchema.get({ _id: data._id })
      const dataCard = {
        uid: uid.v4(),
        number: response.data.creditCardToken.maskedNumber,
        token: response.data.creditCardToken.creditCardTokenId,
        name: response.data.creditCardToken.name,
        identification: response.data.creditCardToken.identificationNumber,
        type: response.data.creditCardToken.paymentMethod,
        securityCode : response.data.creditCardToken.securityCode
      }
      if (user.cards.length > 0) {
        for (const card of user.cards) {
          if (card.token !== response.data.creditCardToken.creditCardTokenId) {
            await UserSchema.update(user._id, { $push: { cards: dataCard } }) 
          }
        }
        return response.data
      } else {
        await UserSchema.update(user._id, { $push: { cards: dataCard } }) 
        return response.data
      }
    } else {
      return { estado: false, data: [], mensaje: 'La fecha de expiración de la tarjeta de crédito no es válida' }
    }
  }
}

module.exports = new PayU()
