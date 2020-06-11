'use strict'
const MakeDataPayU = require('../utils/makeDataPayU')
const axios = require('axios')
const MakeObjectPayment = require('../utils/makeObjectPayment')
const MakeObjectBanks = require('../utils/makeObjectBanks')
const ValidateResponsePayment = require('../utils/validateResponsePayment')
const MakeObjectToken = require('../utils/makeObjectToken')
const MakeObjectPse = require('../utils/makeObjectPse')
const UserSchema = require('../models/userSchema')
const secret = 'vmKeS%O!w!%zmVydx5e*t8k%zDIAMARKET#boaTOKEN*h^l^4sYzCARD$xtGYcpT!j5IP8g#5QJrZ4zyUP26ewqIDU90!Z^D2Tzr%0*LH6AXUORtKskMO'
const crypto = require('crypto')
const uid = require('node-uuid')

class PayU {
  async payCredit(data) {
    data.card.token = crypto.createDecipher('aes-256-ctr', secret).update(data.card.token, 'hex', 'utf8')
    data.card.securityCode = crypto.createDecipher('aes-256-ctr', secret).update(data.card.securityCode, 'hex', 'utf8')
    const objectPayment = MakeObjectPayment(data)
    console.log('----------------------OBJECT PAYMENT CON TOKEN------------------------------------------')
    console.log(objectPayment)
    console.log('----------------------OBJECT PAYMENT CON TOKEN------------------------------------------')
    const response = await axios.post(MakeDataPayU.urlFinal, objectPayment)
    console.log("-------------------------------RESPONSE DE LA PETICION DEL PAGO")
    console.log(response.data)
    console.log("-------------------------------RESPONSE DE LA PETICION DEL PAGO")
    if (response.data.code === 'SUCCESS') {
      switch (response.data.transactionResponse.state) {
        case 'APPROVED': {
          return { status: 'APPROVED', transactionResponse: response.data.transactionResponse }
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
          return { validateResponse, status: 'PENDING', transactionResponse: response.data.transactionResponse }
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
    const response = await axios.post(MakeDataPayU.urlFinal, objectToken)
    console.log('-------------------Token-------------------------------------------')
    console.log(response.data)
    console.log('-------------------Token-------------------------------------------')
    if (response.data.code !== 'ERROR') {
      response.data.creditCardToken.creditCardTokenId = crypto.createCipher('aes-256-ctr', secret).update(response.data.creditCardToken.creditCardTokenId, 'utf8', 'hex')
      response.data.creditCardToken.securityCode = crypto.createCipher('aes-256-ctr', secret).update(data.securityCode.toString(), 'utf8', 'hex')
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
        const flagCard = user.cards.filter(element => element.token === response.data.creditCardToken.creditCardTokenId)
        console.log(flagCard.length)
        if (flagCard.length === 0) {
          await UserSchema.update(user._id, { $push: { cards: dataCard }})
        }
        // for (const card of user.cards) {
        //   console.log(card.token, response.data.creditCardToken.creditCardTokenId)
        //   console.log(card.token === response.data.creditCardToken.creditCardTokenId)
        //   if (card.token !== response.data.creditCardToken.creditCardTokenId) {
        //     await UserSchema.update(user._id, { $push: { cards: dataCard } }) 
        //     break
        //   }
        // }
        return response.data
      } else {
        await UserSchema.update(user._id, { $push: { cards: dataCard } }) 
        return response.data
      }
    } else {
      return { estado: false, data: [], mensaje: response.data.error }
    }
  }

  async dataPse () {
		const objectBanks = MakeObjectBanks()
		try {
      const banks = await axios.post(MakeDataPayU.urlFinal, objectBanks)
      console.log(banks.data)
			const typeClient = [
				{ value: 'N', label: 'Persona natural' },
				{ value: 'J', label: 'persona jurídica' }
			]
			const typeDocument = [
				{ value: 'CC', label: 'Cédula de ciudadanía.' },
				{ value: 'CE', label: 'Cédula de extranjería.' },
				{ value: 'NIT', label: 'Número de Identificación Tributario.' },
				{ value: 'TI', label: 'Tarjeta de Identidad.' },
				{ value: 'PP', label: 'Pasaporte.' },
				{ value: 'IDC', label: 'Identificador único de cliente, para el caso de ID’s únicos de clientes/usuarios de servicios públicos.' },
				{ value: 'CEL', label: 'En caso de identificarse a través de la línea del móvil.' },
				{ value: 'RC', label: 'Registro civil de nacimiento.' },
				{ value: 'DE', label: 'Documento de identificación extranjero.' }
			]
			return { estado: true, data: [ { type: 'typeClient', typeClient },{ type: 'typeDocument', typeDocument },{ type: 'banks', banks: banks.data.banks } ], mensaje: null }
		} catch (error) {
      console.log(error)
			return { estado: false, data: [], mensaje: 'Ha ocurrido un error inesperado' }
		}		
	}
	
	async pse (data) {
    const objectPse = MakeObjectPse(data)
    console.log('------------OBJECT PSE ------------------------')
    console.log(objectPse)
    console.log('------------OBJECT PSE ------------------------')
    const responsePse = await axios.post(MakeDataPayU.urlFinal, objectPse)
    console.log('--------------RESPONSE PSE---------------------------------')
    console.log(responsePse.data)
    console.log('--------------RESPONSE PSE---------------------------------')
		if (responsePse.data.code === 'SUCCESS') {
      switch (responsePse.data.transactionResponse.state) {
        case 'DECLINED': {
          const validateResponse = await ValidateResponsePayment(responsePse.data.transactionResponse)
          return validateResponse
        }

        case 'ERROR': {
          const validateResponse = await ValidateResponsePayment(responsePse.data.transactionResponse)
          return validateResponse
        }

        case 'EXPIRED': {
          const validateResponse = await ValidateResponsePayment(responsePse.data.transactionResponse)
          return validateResponse
        }

        case 'PENDING': {
          // const validateResponse = await ValidateResponsePayment(responsePse.data.transactionResponse)
          return { urlBank: responsePse.data.transactionResponse.extraParameters.BANK_URL , status: 'PENDING' }
        }
        
        case 'CANCELLED': {
          const validateResponse = await ValidateResponsePayment(responsePse.data.transactionResponse)
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
}

module.exports = new PayU()
