'use strict'
const crypto = require('crypto')
const MakeDataPayU = require('../utils/makeDataPayU')

module.exports = function (data) {
   console.log(data)
  const signature = crypto.createHash('md5').update(`${MakeDataPayU.apiKey}~${MakeDataPayU.merchantId}~${data.referenceCode}~${data.value}~COP`).digest('hex')
  const obj = {
    language: 'es',
    command: 'SUBMIT_TRANSACTION',
    merchant: {
       apiKey: MakeDataPayU.apiKey,
       apiLogin: MakeDataPayU.apiLogin
    },
    transaction: {
       order: {
          accountId: MakeDataPayU.accountId.toString(),
          referenceCode: data.referenceCode,
          description: 'payment test',
          language: 'es',
          signature: signature,
          notifyUrl: 'https://api.diamarket.co/v1/app/orderservice/responsepaymentpse',
          additionalValues: {
             TX_VALUE: {
                value: data.value,
                currency: 'COP'
             }
          },
          buyer: {
             merchantBuyerId: data.user._id,
             fullName: data.user.name,
             emailAddress: data.user.email,
             contactPhone: data.user.cellPhone,
             dniNumber: data.user.identification,
             shippingAddress: {
                street1: data.direction.address,
                street2: data.direction.address,
                city: 'Bogota',
                state: 'BO',
                country: 'CO',
                phone: data.user.cellPhone,
             }
          }
       },
       creditCardTokenId: data.card.token,
       creditCard: {
				processWithoutCvv2: 'false',  
				securityCode: data.card.securityCode
       },
       extraParameters: {
         INSTALLMENTS_NUMBER: 1,
         RESPONSE_URL: 'https://api.diamarket.co/v1/app/orderservice/responsepaymentpse'
       },
       type: 'AUTHORIZATION_AND_CAPTURE',
       paymentMethod: data.card.type,
       paymentCountry: 'CO',
       ipAddress: '127.0.0.1'
    },
    test: true
 }
  // const obj = {
  //   'language': 'es',
  //   'command': 'SUBMIT_TRANSACTION',
  //   'merchant': {
  //     'apiKey': 'xryKI4712m8RWNd6Y0uda41rnT',
  //     'apiLogin': 'g0GIx72ZtuCc0jL'
  //   },
  //   'transaction': {
  //     'order': {
  //       'accountId': '846775',
  //       'referenceCode': data.referenceCode,
  //       'description': 'payment test payu diamarket',
  //       'language': 'es',
  //       'signature': signature,
  //       'notifyUrl': 'http://www.tes.com/confirmation',
  //       'additionalValues': {
  //         'TX_VALUE': {
  //           'value': data.value,
  //           'currency': 'COP'
  //         }
  //       }
  //     },
  //     'payer': {
  //       'merchantPayerId': '1',
  //       'fullName': data.user.name,
  //       'emailAddress': data.user.email,
  //       'contactPhone': data.user.cellPhone,
  //       'dniNumber': data.user.identification,
  //       'billingAddress': {
  //         'street1': data.direction.address,
  //         'street2': data.direction.address,
  //         'city': 'Bogota',
  //         'state': 'Bogota DC',
  //         'country': 'CO',
  //         'postalCode': '000000',
  //         'phone': data.user.cellPhone
  //       }
  //     },
  //     'creditCard': {
  //       'number': data.card.number,
  //       'securityCode': data.card.securityCode,
  //       'expirationDate': data.card.expirationDate,
  //       'name': data.card.name
  //     },
  //     'extraParameters': {
  //       'INSTALLMENTS_NUMBER': 1
  //     },
  //     'type': 'AUTHORIZATION_AND_CAPTURE',
  //     'paymentMethod': data.card.type,
  //     'paymentCountry': 'CO'
  //   },
  //   'test': false
  // }
  return obj
}