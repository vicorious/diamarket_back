'use strict'
const axios = require('axios')

async function sendSms (cellPhone, verifyCode) {
  try {
    await axios.post(`http://sms.simlat.com.co/smsapi/pushsms.aspx?user=ZYSB2C&password=ZYSB2C!*&msisdn=${cellPhone}&sid=87451&msg=Bienvenido a Diamarket, tu codigo de verificacion es ${verifyCode}&fl=0`)
  } catch (error) {
    return { error: { message: 'Error al enviar el mensaje de texto' } }
  }
}

module.exports = { sendSms }
