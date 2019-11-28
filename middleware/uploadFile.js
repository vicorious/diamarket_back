'use strict'
const AWS = require('aws-sdk')
const uuid = require('node-uuid')
const bucketName = 'helpmi-s3'


async function uploadFile (image, originalname, type) {

  const ID = 'AKIAJEATWRXNRLPW2OVA'
  const SECRET = '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'
  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  });
  const params = {
    Bucket: bucketName,
    /*CreateBucketConfiguration: {
      // Set your region here
      LocationConstraint: "eu-west-1"
    }*/
  };


  let name = uuid.v4() + '/tuikit/' + originalname
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
  const file = await s3.upload(params).promise()
  return file.Location
}

module.exports = uploadFile
