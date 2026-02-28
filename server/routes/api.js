const express = require('express');
const router = express.Router();
const Participant = require('../models/Participante');
const Stand = require('../models/Estand');
const Visit = require('../models/Visita');
const Survey = require('../models/Encuesta');
const moment = require('moment');

// --- Participant Routes ---

router.post('/participants', async (req, res) => {
  try {
    const participant = new Participant(req.body);
    participant.qrCode = participant.email; 
    await participant.save();
    res.status(201).json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/participants', async (req, res) => {
  try {
    const participants = await Participant.find().sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/participants/:id', async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/participants/:id', async (req, res) => {
  try {
    await Participant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Participante eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/participants/:qrCode', async (req, res) => {
  try {
    const participant = await Participant.findOne({ qrCode: req.params.qrCode });
    if (!participant) return res.status(404).json({ error: 'Participant not found' });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Stand Routes ---

router.post('/stands', async (req, res) => {
  try {
    const stand = new Stand(req.body);
    await stand.save();
    res.status(201).json(stand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/stands', async (req, res) => {
  try {
    const stands = await Stand.find();
    res.json(stands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Visit & Scanning Logic ---

router.post('/visits/scan', async (req, res) => {
  const { qrCode, standId } = req.body;
  const COOLDOWN_MINUTES = parseInt(process.env.COOLDOWN_MINUTES) || 120;
  const STAND_LIMIT = parseInt(process.env.STAND_LIMIT) || 5;

  try {
    const participant = await Participant.findOne({ qrCode });
    if (!participant) return res.status(404).json({ error: 'Participant not found' });

    const stand = await Stand.findById(standId);
    if (!stand) return res.status(404).json({ error: 'Stand not found' });

    const now = moment();
    const lastReset = moment(participant.lastVisitReset);
    if (now.diff(lastReset, 'minutes') >= COOLDOWN_MINUTES) {
      participant.currentVisitCount = 0;
      participant.lastVisitReset = now.toDate();
    }

    if (participant.currentVisitCount >= STAND_LIMIT) {
      return res.status(403).json({ 
        error: 'Limit reached', 
        message: 'Has alcanzado el límite de 5 estand. Vuelve más tarde.' 
      });
    }

    const existingVisit = await Visit.findOne({
      participant: participant._id,
      stand: standId,
      timestamp: { $gte: participant.lastVisitReset }
    });

    if (existingVisit) {
      return res.status(400).json({ error: 'Already visited', message: 'Ya has registrado tu visita en este estand.' });
    }

    const visit = new Visit({ participant: participant._id, stand: standId });
    await visit.save();

    participant.currentVisitCount += 1;
    await participant.save();

    res.json({ message: 'Visit recorded', participant, visit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Survey Routes ---

router.post('/surveys', async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Report Routes ---

router.get('/reports/stats', async (req, res) => {
  try {
    const totalParticipants = await Participant.countDocuments();
    const totalStands = await Stand.countDocuments();
    const totalVisits = await Visit.countDocuments();
    const surveysCount = await Survey.countDocuments();
    
    const avgSatisfaction = await Survey.aggregate([
      { $group: { _id: null, avg: { $avg: { $add: ['$q1', '$q2', '$q3', '$q4', '$q5'] } } } }
    ]);

    res.json({
      totalParticipants,
      totalStands,
      totalVisits,
      surveysCount,
      avgSatisfaction: avgSatisfaction.length > 0 ? (avgSatisfaction[0].avg / 5).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/stand-analytics', async (req, res) => {
  try {
    // Visits per stand
    const visitStats = await Visit.aggregate([
      { $group: { _id: '$stand', count: { $sum: 1 } } },
      { $lookup: { from: 'estands', localField: '_id', foreignField: '_id', as: 'standDetails' } },
      { $unwind: '$standDetails' },
      { $project: { name: '$standDetails.name', count: 1 } }
    ]);

    // Satisfaction per stand
    const surveyStats = await Survey.aggregate([
      { $group: { 
          _id: '$stand', 
          avgRating: { $avg: { $add: ['$q1', '$q2', '$q3', '$q4', '$q5'] } } 
      } },
      { $lookup: { from: 'estands', localField: '_id', foreignField: '_id', as: 'standDetails' } },
      { $unwind: '$standDetails' },
      { $project: { name: '$standDetails.name', avgRating: { $divide: ['$avgRating', 5] } } }
    ]);

    res.json({ visitStats, surveyStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/stand-visits', async (req, res) => {
  try {
    const stats = await Visit.aggregate([
      { $group: { _id: '$stand', count: { $sum: 1 } } },
      { $lookup: { from: 'estands', localField: '_id', foreignField: '_id', as: 'standDetails' } },
      { $unwind: '$standDetails' },
      { $project: { name: '$standDetails.name', count: 1 } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
