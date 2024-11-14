// backend/models/sessionModel.js

const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  sessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },           // Default to active on session creation
  deactivatedAt: { type: Date },                        // Deactivation timestamp
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
