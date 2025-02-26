const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
//import bodyParser from "body-parser";
//import { sendPush } from "./SendPush.js"; // Importa la función desde el archivo correspondiente
const  suscrip = require('./rutas/suscripcion.js');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  

// Configurar la ruta principal de la API
app.use('/api/subs', suscrip);

// Ruta base para verificar si el servidor está funcionando
app.get("/", (req, res) => {
    res.send('API funcionando');
  });
  

//app.post("/sendNotification", sendPush); // Ruta para enviar notificaciones


// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));
