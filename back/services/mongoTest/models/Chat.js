

// models/Motocicleta.js
// const mongoose = require('mongoose');

import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  participants: { type: Array, required: true },
  idAsso: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Chat', ChatSchema);
