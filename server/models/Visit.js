const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
  stand: { type: mongoose.Schema.Types.ObjectId, ref: 'Stand', required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', VisitSchema);
