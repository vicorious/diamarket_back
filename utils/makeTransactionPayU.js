'use strict'

module.exports = function (data) {
  const obj = {
    test: false,
    language: 'en',
    command: 'ORDER_DETAIL_BY_REFERENCE_CODE',
    merchant: {
      apiLogin: 'pRRXKOl8ikMmt9u',
      apiKey: '4Vj8eK4rloUd272L48hsrarnUA'
    },
    details: {
      referenceCode: data.referenceCode
    }
  }
  return obj
}