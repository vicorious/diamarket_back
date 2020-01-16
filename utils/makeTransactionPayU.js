'use strict'
Pruebas: https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi
Producción: https://api.payulatam.com/reports-api/4.0/service.cgi

module.exports = function (data) {
  const obj = {
    "test": true,
    "language": "es",
    "command": "TRANSACTION_RESPONSE_DETAIL",
    "merchant": {
       "apiLogin": "pRRXKOl8ikMmt9u",
       "apiKey": "4Vj8eK4rloUd272L48hsrarnUA"
    },
    "details": {
       "transactionId": data.transactionId
    }
 }
  return obj
}
