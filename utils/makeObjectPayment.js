'use strict'
const crypto = require('crypto')

module.exports = function (data) {
  console.log(data)
  const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~${data.value}~COP`).digest('hex')
//   const obj = {
//     language: 'es',
//     command: 'SUBMIT_TRANSACTION',
//     merchant: {
//        apiKey: 'xryKI4712m8RWNd6Y0uda41rnT',
//        apiLogin: 'g0GIx72ZtuCc0jL'
//     },
//     transaction: {
//        order: {
//           accountId: '846775',
//           referenceCode: data.referenceCode,
//           description: 'payment test',
//           language: 'es',
//           signature: signature,
//           notifyUrl: 'http://www.tes.com/confirmation',
//           additionalValues: {
//              TX_VALUE: {
//                 value: 100,
//                 currency: 'BRL'
//              }
//           },
//           buyer: {
//              merchantBuyerId: '1',
//              fullName: 'First name and second buyer  name',
//              emailAddress: 'buyer_test@test.com',
//              contactPhone: '(11)756312633',
//              dniNumber: '811.807.405-64',
//              cnpj: '32593371000110',
//              shippingAddress: {
//                 street1: 'calle 100',
//                 street2: '5555487',
//                 city: 'Sao paulo',
//                 state: 'SP',
//                 country: 'BR',
//                 postalCode: '01019-030',
//                 phone: '(11)756312633'
//              }
//           }
//        },
//        creditCardTokenId: data.card.token,
//        extraParameters: {
//           INSTALLMENTS_NUMBER: 1
//        },
//        type: 'AUTHORIZATION',
//        paymentMethod: 'VISA',
//        paymentCountry: 'BR',
//        ipAddress: '127.0.0.1'
//     },
//     test: true
//  }
console.log(data.referenceCode)
  const obj = {
    'language': 'es',
    'command': 'SUBMIT_TRANSACTION',
    'merchant': {
      'apiKey': 'xryKI4712m8RWNd6Y0uda41rnT',
      'apiLogin': 'g0GIx72ZtuCc0jL'
    },
    'transaction': {
      'order': {
        'accountId': '846775',
        'referenceCode': data.referenceCode,
        'description': 'payment test payu diamarket',
        'language': 'es',
        'signature': signature,
        'notifyUrl': 'http://www.tes.com/confirmation',
        'additionalValues': {
          'TX_VALUE': {
            'value': data.value,
            'currency': 'COP'
          }
        }
      },
      'payer': {
        'merchantPayerId': '1',
        'fullName': data.user.name,
        'emailAddress': data.user.email,
        'contactPhone': data.user.cellPhone,
        'dniNumber': data.user.identification,
        'billingAddress': {
          'street1': data.direction.address,
          'street2': data.direction.address,
          'city': 'Bogota',
          'state': 'Bogota DC',
          'country': 'CO',
          'postalCode': '000000',
          'phone': data.user.cellPhone
        }
      },
      'creditCard': {
        'number': data.card.number,
        'securityCode': data.card.securityCode,
        'expirationDate': data.card.expirationDate,
        'name': data.card.name
      },
      'extraParameters': {
        'INSTALLMENTS_NUMBER': 1
      },
      'type': 'AUTHORIZATION_AND_CAPTURE',
      'paymentMethod': data.card.type,
      'paymentCountry': 'CO'
    },
    'test': false
  }
  return obj
}