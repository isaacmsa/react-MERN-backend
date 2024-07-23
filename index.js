/* Configuracion inicial de express */
const path = require('path')
const express = require('express')
require('dotenv').config()
const { dbConnection } = require('./database/config')
const cors = require('cors')

/* Servidor de express */
const app = express()

/* Base de datos */
dbConnection()

// Cors
app.use(cors())

// Directorio publico
app.use(express.static('public'))
// "Use" en express es conocido como un middleware (middleware es una funcion que se ejecuta cada vez que se hace una peticion al servidor o la ruta)
// express.static('archivo index.html') para utilzar  el directorio public y renderizar el html de alli

// Lectura y parseo del body
app.use(express.json())

/* Rutas */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

/* Escuchando peticiones */
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})
