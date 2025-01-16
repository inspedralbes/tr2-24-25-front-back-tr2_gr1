import mongoose from 'mongoose';

const VotSchema = new mongoose.Schema({
  idActivitat: { type: Number, required: true },
  idUsuari: { type: Number, required: true },
  vot: { type: Boolean, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('Vot', VotSchema);
