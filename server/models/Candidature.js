const mongoose = require('mongoose');

const candidatureSchema = new mongoose.Schema({
  nomEntreprise: String,
  coordonnees: String,
  provenanceAnnonce: String,
  technos: String,
  reponseEntretienRefus: String,
  lieu: String,
  intitulePoste: String,
  descriptionPoste: String,
  dateCandidature: Date,
  dateRefus: Date,
  dateRelance: Date,
});

module.exports = mongoose.model('Candidature', candidatureSchema);
