const mongoose = require('mongoose');

const suiviSchema = new mongoose.Schema({
  dateSuivi: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Suivi', suiviSchema);
