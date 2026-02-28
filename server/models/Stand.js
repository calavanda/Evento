const mongoose = require('mongoose');

const StandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  responsible: { type: String, required: true }, // Student or Team name
  description: { type: String },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Stand', StandSchema);
