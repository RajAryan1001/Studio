const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
});

module.exports = mongoose.model('Artist', artistSchema);