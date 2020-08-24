'use strict'
const AWS = require('aws-sdk')
const uuid = require('node-uuid')
const bucketName = 'diamarket-s3'

async function uploadFile (image, originalname, type) {

  const ID = 'AKIAJFVTEUNHP6HKLDIA'
  const SECRET = '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'
  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  });
  const params = {
    Bucket: bucketName
  };


  let name = uuid.v4() + '/diamarket/' + originalname
  name = name.replace(/\s+/g, '-')

  if (type === 'base64') {
    params.Bucket = bucketName
    params.Body = image
    params.ContentEncoding = 'base64'
    params.Key = name
    params.ACL = 'public-read'
  } else {
    params.Bucket = bucketName
    params.Body = image.buffer
    params.Key = name
    params.ACL = 'public-read'
  }
  console.log(params)
  const file = await s3.upload(params).promise()
  return file.Location
}

module.exports = uploadFile
