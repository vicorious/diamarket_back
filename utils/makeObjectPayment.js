'use strict'
const crypto = require('crypto')

module.exports = function (data) {
  const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~${data.value}~COP`).digest('hex')
  const obj = {
    language: 'es',
    command: "SUBMIT_TRANSACTION",
    merchant: {
      apiKey: 'xryKI4712m8RWNd6Y0uda41rnT',
      apiLogin: 'g0GIx72ZtuCc0jL'
    },
    transaction: {
      order: {
        accountId: '846775',
        referenceCode: data.referenceCode,
        description: data.description,
        language: 'es',
        signature,
        additionalValues: {
          TX_VALUE: {
            value: data.value,
            currency: 'COP'
          },
          TX_TAX: {
            value: 0,
            currency: 'COP'
          },
          TX_TAX_RETURN_BASE: {
            value: 0,
            currency: 'COP'
          }
        },
        buyer: {
          merchantBuyerId: data.user._id,
          fullName: data.user.name,
          emailAddress: data.user.email,
          contactPhone: data.user.cellPhone,
          dniNumber: data.user.identification
        }
      },
      payer: {
        merchantPayerId: data.user._id,
        fullName: data.user.name,
        emailAddress: data.user.email,
        contactPhone: data.user.cellPhone,
        dniNumber: data.user.identification
      },
      creditCard: {
        number: data.card.number,
        securityCode: data.card.securityCode,
        expirationDate: data.card.expirationDate,
        name: data.card.name
      },
      type: 'AUTHORIZATION_AND_CAPTURE',
      paymentMethod: data.card.type,
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1",
      ipAddress: "127.0.0.1"
    },
    test: true
  }
  return obj
}