'use strict'
require('./config/MongoDb')
// require('./config/SqlServer')
const express = require('express')
const asyncify = require('express-asyncify')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')
const routeUser = require('./urls/routes')
const cookieParser = require('cookie-parser')
// const serviceAccount = require('./utils/diamarket-4d0e1-firebase-adminsdk-yl7nn-3e9ee60af1.json')
// const SqlServer = require('mssql')
// const adminFirebase = require('firebase-admin')
// const config = require('./utils/makeFirebase')

const port = 5002
// const registrationToken = 'HOLAHOLAHOLA123456'
// const payload = {
//   data: {
//     key: "HOLA AMIGO"
//   }
// }
// const options = {
//   priority: 'high',
//   timeToLive: 60 * 60 * 24
// }
const app = asyncify(express())
const server = http.createServer(app)
// adminFirebase.initializeApp({
//   credential: adminFirebase.credential.cert(serviceAccount),
//   databaseURL: 'https://diamarket-4d0e1.firebaseio.com'
// })
// adminFirebase.messaging().sendToDevice(registrationToken, payload, options)
//   .then(function (response) {
//     console.log(response.results)
//   })
//   .catch(function (error) {
//     console.log('error', error)
//   })

app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json({ extended: true, limit: '20000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '20000mb' }))
app.use(cookieParser())
// app.use('/data', async (request, response) => {
//   const req = new SqlServer.Request()
//   req.query('SELECT dbo_t126_mc_items_precios.f126_id_cia, dbo_t126_mc_items_precios.f126_id_lista_precio, dbo_t126_mc_items_precios.f126_rowid_item, dbo_t126_mc_items_precios.f126_rowid_item_ext, dbo_t126_mc_items_precios.f126_fecha_activacion, dbo_t150_mc_bodegas.f150_id_co, dbo_t126_mc_items_precios.f126_id_unidad_medida, dbo_t126_mc_items_precios.f126_precio, dbo_t126_mc_items_precios.f126_precio_sugerido, dbo_t126_mc_items_precios.f126_fecha_inactivacion, dbo_t400_cm_existencia.f400_cant_existencia_1, dbo_t150_mc_bodegas.f150_descripcion
//   FROM (dbo_t126_mc_items_precios INNER JOIN (dbo_t400_cm_existencia INNER JOIN dbo_t121_mc_items_extensiones ON dbo_t400_cm_existencia.f400_rowid_item_ext = dbo_t121_mc_items_extensiones.f121_rowid) ON (dbo_t126_mc_items_precios.f126_rowid_item = dbo_t121_mc_items_extensiones.f121_rowid_item) AND (dbo_t126_mc_items_precios.f126_id_cia = dbo_t121_mc_items_extensiones.f121_id_cia)) INNER JOIN dbo_t150_mc_bodegas ON dbo_t400_cm_existencia.f400_rowid_bodega = dbo_t150_mc_bodegas.f150_rowid
//   WHERE (((dbo_t126_mc_items_precios.f126_id_cia)=6) AND ((dbo_t126_mc_items_precios.f126_id_lista_precio)="050") AND ((dbo_t126_mc_items_precios.f126_fecha_inactivacion) Is Null) AND ((dbo_t150_mc_bodegas.f150_descripcion) Like "%PRINCIPAL%"))
//   ORDER BY dbo_t126_mc_items_precios.f126_rowid_item, dbo_t150_mc_bodegas.f150_id_co, dbo_t126_mc_items_precios.f126_id_unidad_medida;
//   ')
// })
// app.use(async (request, response, next) => {
//   const messaging = adminFirebase.messaging()
//   console.log(messaging)
//   //request.firebaseId = {}
//   next()
// })
app.use('/v1', routeUser)

server.listen(port, () => {
  console.log(`${chalk.green('[diamarket-account]')} server listening on port ${port}`)
})

module.exports = server
