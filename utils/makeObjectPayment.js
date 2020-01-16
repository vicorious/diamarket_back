'use strict'

module.exports = function (data) {
  const obj = {
    language: 'es',
    command: 'SUBMIT_TRANSACTION',
    merchant: {
      apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
      apiLogin: 'pRRXKOl8ikMmt9u'
    },
    transaction: {
      order: {
        accountId: data.user._id,
        referenceCode: data.reference,
        description: 'Compra de mercado en Dia Market',
        language: 'es',
        signature: data.reference,
        additionalValues: {
          TX_VALUE: {
            value: data.value,
            currency: 'COP'
          },
          TX_TAX: {
            value: 19000,
            currency: 'COP'
          },
          TX_TAX_RETURN_BASE: {
            value: 0,
            currency: 'COP'
          }
        },
        buyer: {
          fullName: data.user.name,
          emailAddress: data.user.email,
          contactPhone: data.user.cellPhone,
          dniNumber: data.user.cellPhone,
          shippingAddress: {
            street1: data.direction.address,
            street2: data.direction.address,
            city: data.direction.address,
            state: data.direction.address,
            country: 'CO',
            postalCode: '000000',
            phone: data.user.cellPhone
          }
        },
        shippingAddress: {
          street1: data.direction.address,
          street2: data.direction.address,
          city: data.direction.address,
          state: data.direction.address,
          country: 'CO',
          postalCode: '0000000',
          phone: data.user.cellPhone
        }
      },
      payer: {
        fullName: data.user.name,
        emailAddress: data.user.email,
        contactPhone: data.user.cellPhone,
        dniNumber: data.user.cellPhone,
        billingAddress: {
          street1: data.direction.address,
          street2: data.direction.address,
          city: data.direction.address,
          state: data.direction.address,
          country: 'CO',
          postalCode: '000000',
          phone: data.user.cellPhone
        }
      },
      creditCard: {
        number: data.card.number,
        securityCode: data.card.securityCode,
        expirationDate: data.card.expirationDate,
        name: data.card.name
      },
      type: 'AUTHORIZATION',
      paymentMethod: data.card.type,
      paymentCountry: 'CO',
      deviceSessionId: data.deviceSessionId,
      ipAddress: data.ipAddress,
      cookie: data.cookie,
      userAgent: data.userAgent
    },
    test: false
  }
  return obj
}
