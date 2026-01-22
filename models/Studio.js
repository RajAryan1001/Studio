const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  specialties: [String],
});

module.exports = mongoose.model('Studio', studioSchema);