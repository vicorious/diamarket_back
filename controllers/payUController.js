'use strict'
// Decirle a nestor que el valor de la orden debe ir junto al iba y al iba de la orden
// const MakeUrlPayU = require('../utils/makeUrlPayU')
// const MakeObjectPaymen = require('../utils/makeObjectPayment')
const axios = require('axios')
const MakeTransactionPayU = require('../utils/makeTransactionPayU')
const MakeUrlPayU = require('../utils/makeUrlPayU')

class PayU {
  async payCredit () {}

  async payCash () {}

  async payDebit () {}

  async findTransaction (data) {
    const transaction = await MakeTransactionPayU(data)
    const response = await axios.post(MakeUrlPayU, transaction)
    return response.data.result.payload
  }
}

module.exports = new PayU()
