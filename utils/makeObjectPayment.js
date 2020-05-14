'use strict'
const crypto = require('crypto')

module.exports = function (data) {
  const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~${data.value}~COP`).digest('hex')
  const obj = {
    "language": "es",
    "command": "SUBMIT_TRANSACTION",
    "merchant": {
       "apiKey": "4Vj8eK4rloUd272L48hsrarnUA",
       "apiLogin": "pRRXKOl8ikMmt9u"
    },
    "transaction": {
       "order": {
          "accountId": "512327",
          "referenceCode": "payment_test_00000001",
          "description": "payment test",
          "language": "es",
          "signature": signature,
          "notifyUrl": "http://www.tes.com/confirmation",
          "additionalValues": {
             "TX_VALUE": {
                "value": 100,
                "currency": "BRL"
             }
          },
          "buyer": {
             "merchantBuyerId": "1",
             "fullName": "First name and second buyer  name",
             "emailAddress": "buyer_test@test.com",
             "contactPhone": "(11)756312633",
             "dniNumber": "811.807.405-64",
             "cnpj": "32593371000110",
             "shippingAddress": {
                "street1": "calle 100",
                "street2": "5555487",
                "city": "Sao paulo",
                "state": "SP",
                "country": "BR",
                "postalCode": "01019-030",
                "phone": "(11)756312633"
             }
          }
       },
       "creditCardTokenId": "8604789e-80ef-439d-9c3f-5d4a546bf637",
       "extraParameters": {
          "INSTALLMENTS_NUMBER": 1
       },
       "type": "AUTHORIZATION",
       "paymentMethod": "VISA",
       "paymentCountry": "BR",
       "ipAddress": "127.0.0.1"
    },
    "test": false
 }
  // const obj = {
  //   "language": "es",
  //   "command": "SUBMIT_TRANSACTION",
  //   "merchant": {
  //     "apiKey": "xryKI4712m8RWNd6Y0uda41rnT",
  //     "apiLogin": "g0GIx72ZtuCc0jL"
  //   },
  //   "transaction": {
  //     "order": {
  //       "accountId": "846775",
  //       "referenceCode": "test",
  //       "description": "payment test payu diamarket",
  //       "language": "es",
  //       "signature": signature,
  //       "notifyUrl": "http://www.tes.com/confirmation",
  //       "additionalValues": {
  //         "TX_VALUE": {
  //           "value": 20000,
  //           "currency": "COP"
  //         }
  //       }
  //     },
  //     "payer": {
  //       "merchantPayerId": "1",
  //       "fullName": "FABIAN ZAPATA",
  //       "emailAddress": "payer_test@test.com",
  //       "contactPhone": "7563126",
  //       "dniNumber": "1013636219",
  //       "billingAddress": {
  //         "street1": "calle 93",
  //         "street2": "125544",
  //         "city": "Bogota",
  //         "state": "Bogota DC",
  //         "country": "CO",
  //         "postalCode": "000000",
  //         "phone": "7563126"
  //       }
  //     },
  //     "creditCard": {
  //       "number": "5180920004333423",
  //       "securityCode": "388",
  //       "expirationDate": "2023/04",
  //       "name": "APPROVED"
  //     },
  //     "extraParameters": {
  //       "INSTALLMENTS_NUMBER": 1
  //     },
  //     "type": "AUTHORIZATION_AND_CAPTURE",
  //     "paymentMethod": "MASTERCARD",
  //     "paymentCountry": "CO"
  //   },
  //   "test": false
  // }
  return obj
}