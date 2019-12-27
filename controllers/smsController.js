'use strict'
const twilio = require('twilio')
const accountId = 'AC19e5b1890b43ebfcf6e4e2a8b3ddcc97'
const authToken = '0327aa3ac0ff856276aa31e4a78188e8'
const numberTwilio = '+14234541365'
const client = new twilio(accountId, authToken)


class Sms {

    async send(cellphone, body) {
        console.log(cellphone, body);
        try {
            await client.messages.create({
                body: body,
                to: `+57${cellphone}`,
                from: numberTwilio
            }).then((message) => console.log("mensaje mensaje",message))
        } catch (error) {
            console.log(error)
        }
        
    }


}

module.exports = new Sms()