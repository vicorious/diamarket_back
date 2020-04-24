'use strict'
const crypto = require('crypto')

module.exports = function (data) {
  const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~${data.value}~COP`).digest('hex')

  const obj = {
    "language": "es",
    "command": "SUBMIT_TRANSACTION",
    "merchant": {
      "apiKey": "xryKI4712m8RWNd6Y0uda41rnT",
      "apiLogin": "g0GIx72ZtuCc0jL"
    },
    "transaction": {
      "order": {
        "accountId": "846775",
        "referenceCode": "test",
        "description": "payment test payu diamarket",
        "language": "es",
        "signature": signature,
        "notifyUrl": "http://www.tes.com/confirmation",
        "additionalValues": {
          "TX_VALUE": {
            "value": 20000,
            "currency": "COP"
          }
        }
      },
      "payer": {
        "merchantPayerId": "1",
        "fullName": "FABIAN ZAPATA",
        "emailAddress": "payer_test@test.com",
        "contactPhone": "7563126",
        "dniNumber": "1013636219",
        "billingAddress": {
          "street1": "calle 93",
          "street2": "125544",
          "city": "Bogota",
          "state": "Bogota DC",
          "country": "CO",
          "postalCode": "000000",
          "phone": "7563126"
        }
      },
      "creditCard": {
        "number": "5180920004333423",
        "securityCode": "388",
        "expirationDate": "2023/04",
        "name": "APPROVED"
      },
      "extraParameters": {
        "INSTALLMENTS_NUMBER": 1
      },
      "type": "AUTHORIZATION_AND_CAPTURE",
      "paymentMethod": "MASTERCARD",
      "paymentCountry": "CO"
    },
    "test": false
  }
  return obj
}