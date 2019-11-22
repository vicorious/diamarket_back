'use strict'
const twilio = require('twilio')
const accountId = 'ACc3011e08a0913177b6248e84a8d684cd'
const authToken = '97aea70ee6603da9781e309df8998721'
const numberTwilio = '+12056192898'
const client = new twilio(accountId, authToken)


class Sms {


    send(cellphone, body) {

        client.messages.create({
            body: body,
            to: `+${cellphone}`,
            from: numberTwilio
        }).then((message) => console.log(message.sid))
    }


}

module.exports = new Sms()