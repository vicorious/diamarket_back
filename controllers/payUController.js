'use strict'
const MakeUrlPayU = require('../utils/makeUrlPayU')
const axios = require('axios')
const MakeObjectPayment = require('../utils/makeObjectPayment')
const ValidateResponsePayment = require('../utils/validateResponsePayment')

class PayU {
  async payCredit (data) {
    const objectPayment = MakeObjectPayment(data)
    const response = await axios.post(MakeUrlPayU, objectPayment)
    console.log(response)
    // switch (response.data.transactionResponse.state) {
    //   case 'APPROVED': {
    //     return true
    //   }
    //   case 'DECLINED': {
    //     const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
    //     return validateResponse
    //   }

    //   case 'CANCELLED': {
    //     const validateResponse = await ValidateResponsePayment(response.data.transactionResponse)
    //     return validateResponse
    //   }
    // }
  }

  async payCash () {}

  async payDebit () {}
}

module.exports = new PayU()
