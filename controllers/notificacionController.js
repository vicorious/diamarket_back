'use strict'
const AdminFirebase = require('firebase-admin')

class Notification {
  async messaging (data) {
    const payload = {
      notification: {
        title: data.title,
        body: data.body
      },
      data: {
        TYPE: data.TYPE,
        body: data.bodydata
      }
    }
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
   } 
    AdminFirebase
      .messaging()
      .sendToDevice(data.registrationToken, payload, options)
      .then(res => {
        console.log('Successfully sent message:', res)
      })
      .catch(err => {
        console.log('Error sending message:', err)
      })
  }
}

module.exports = new Notification()
