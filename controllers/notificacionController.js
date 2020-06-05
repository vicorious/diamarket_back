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
        _id: data._id.toString(),
        state: data.status ? data.status.toString() : data.state.toString()
      }
    }
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
   } 
   console.log("*****************************")
   console.log(data, payload, options)
   console.log("*****************************")
   const message = await AdminFirebase.messaging().sendToDevice(data.tokenMessaging, payload, options)
   console.log(message)
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
