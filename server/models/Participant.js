const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastNamePaternal: { type: String, required: true },
  lastNameMaternal: { type: String, required: true },
  city: { type: String, required: true },
  municipality: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F', 'Other'], required: true },
  email: { type: String, required: true, unique: true },
  qrCode: { type: String }, // Can store a UUID or email as the QR content
  registrationDate: { type: Date, default: Date.now },
  currentVisitCount: { type: Number, default: 0 },
  lastVisitReset: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participante', ParticipantSchema);
