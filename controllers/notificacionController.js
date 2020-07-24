'use strict'
const AdminFirebase = require('firebase-admin')

class Notification {
  async messaging (data) {
    let payload = {
      notification: {
        title: data.title,
        body: data.body
      }
    }
    if (data.supermarket) {
      payload.data = {
        _id: data._id.toString(),
        supermarket: data.supermarket.toString()
      }
    } else {
      payload.data = {
        _id: data._id.toString(),
        state: data.status.toString()
      }
    }


    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
   }
   console.log(payload)
   console.log(data)
   try {
    const message = await AdminFirebase.messaging().sendToDevice(data.tokenMessaging, payload, options) 
   console.log(message)
   } catch (error) {
     console.log(error)
   }
    // AdminFirebase
    //   .messaging()
    //   .sendToDevice(data.tokenMessaging, payload, options)
    //   .then(res => {
    //     console.log('Successfully sent message:', res)
    //   })
    //   .catch(err => {
    //     console.log('Error sending message:', err)
    //   })
  }
}

module.exports = new Notification()
