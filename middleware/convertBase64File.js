'use strict'
const uploadFile = require('./uploadFile')
const uuid = require('node-uuid')

async function convertBase64ToFile(request, response, next) {
  if (request.body.logo) {
    const data = request.body.logo.split(',')
    if (data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' || data[0] === 'data:application/pdf;base64') {
      const name = `${uuid.v4()}.${data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' ? 'jpg' : 'pdf'}`
      request.body.logo = await uploadFile(Buffer.from(data[1], 'base64'), name, 'base64')
    }
  }
  if (request.body.images) {
    if (Array.isArray(request.body.images)) {
      if (request.body.images.length > 0) {
        const urlImages = []
        for (const document of request.body.images) {
          const data = document.split(',')
          if (data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' || data[0] === 'data:application/pdf;base64') {
            const name = `${uuid.v4()}.${data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' ? 'jpg' : 'pdf'}`
            const file = await uploadFile(Buffer.from(data[1], 'base64'), name, 'base64')
            urlImages.push(file)
          } else {
            urlImages.push(document)
          }
        }
        request.body.images = urlImages
      }
      next()
    } else {
      const data = request.body.images.split(',')
      let images
      if (data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' || data[0] === 'data:application/pdf;base64') {
        const name = `${uuid.v4()}.${data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' ? 'jpg' : 'pdf'}`
        const file = await uploadFile(Buffer.from(data[1], 'base64'), name, 'base64')
        images = file
      }
      request.body.images = images
    }
  }
  if (request.body.image) {
    if (request.body.image > 0) {
      const data = request.body.image.split(',')
      let image
      if (data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64') {
        const name = `${uuid.v4()}.${data[0] === 'data:image/jpeg;base64' || data[0] === 'data:image/png;base64' ? 'jpg' : 'pdf'}`
        const file = await uploadFile(Buffer.from(data[1], 'base64'), name, 'base64')
        image = file
      }
      request.body.image = image
    }
  }
  next()
}

module.exports = {
  convertBase64ToFile
}
