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
}

module.exports = {
    convertBase64ToFile
}
