const express = require('express');
const router = express.Router();
const { sendPush } = require('../SendPush.js');  // Usar require en lugar de import
const subs = require('../models/subsModel.js');
const webpush = require('web-push');

router.post('/suscripcion', async (req, res) => {
  const { suscripcion} = req.body;

  try { 

    // Crear el nueva suscripcion
    const newSub = new subs({ suscripcion });
    const savedSub = await newSub.save();
    // Después de guardar la suscripción, enviar la notificación
    await sendPush(savedSub.suscripcion);  // Llamar a la función sendPush con la suscripción guardada

    res.status(201).json(savedSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;

