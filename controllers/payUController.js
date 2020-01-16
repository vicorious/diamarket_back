'use strict'
// Decirle a nestor que el valor de la orden debe ir junto al iba y al iba de la orden
const MakeUrlPayU = require('../utils/makeUrlPayU')
const MakeObjectPaymen = require('../utils/makeObjectPayment')

class PayU {
  async payCredit () {
    
  }

  async payCash () {}

  async payDebit () {}
}

module.exports = new PayU()
