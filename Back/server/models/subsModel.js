const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  suscripcion: {
    endpoint: {
      type: String,
      unique: true
    },
    expireTime: {
      type: Date  
    },
    keys: {
      p256dh: {
        type: String,  
      },
      auth: {
        type: String 
      }
    }
  }
});

module.exports = mongoose.model('Subs', SubSchema, 'suscripciones');
