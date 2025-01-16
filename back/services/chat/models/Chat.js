import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  participants: { type: Array, required: true },
  idAsso: { type: Number, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('Chat', ChatSchema);
