const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }, 
  stand: { type: mongoose.Schema.Types.ObjectId, ref: 'Estand', required: true },
  q1: { type: Number, required: true }, // Satisfaction rating 1-5
  q2: { type: Number, required: true },
  q3: { type: Number, required: true },
  q4: { type: Number, required: true },
  q5: { type: Number, required: true },
  comments: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuesta', SurveySchema);
