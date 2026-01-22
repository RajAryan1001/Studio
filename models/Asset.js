const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  originalPath: { type: String, required: true },
  optimizedPath: { type: String },
  studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
});

module.exports = mongoose.model('Asset', assetSchema);