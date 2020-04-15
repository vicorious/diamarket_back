'use strict'
const MakeUrlPayU = require('../utils/makeUrlPayU')
const axios = require('axios')
const MakeObjectPayment = require('../utils/makeObjectPayment')
const ValidateResponsePayment = require('../utils/validateResponsePayment')

class PayU {
  async payCredit(data) {
    const objectPayment = MakeObjectPayment(data)
    const response = await axios.post(MakeUrlPayU, objectPayment)
    console.log(response.data)
    if (response.data.code === 'SUCCESS') {
      switch (response.data.transactionResponse.state) {
        case 'APPROVED': {
          return true
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
          return validateResponse
        }
        
        case 'CANCELLED': {
          const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
          return validateResponse
        }

        default: {
          return { estado: false, data: [], mensaje: 'Ocurrió un error general.' }
        }
      }
    } else {
      return { estado: false, data: [], mensaje: 'Ocurrió un error general.' }
    }
  }

  async payCash() { }

  async payDebit() { }
}

module.exports = new PayU()
