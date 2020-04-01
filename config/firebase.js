const serviceAccount = require('./diamarket-260522-firebase-adminsdk-o4r4b-f8f9ff24d5.json')
const AdminFirebase = require('firebase-admin')

AdminFirebase.initializeApp({
  credential: AdminFirebase.credential.cert(serviceAccount),
  databaseURL: 'https://diamarket-260522.firebaseio.com'
})