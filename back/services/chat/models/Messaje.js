import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    idAsso: { type: Number, required: true },
    idUser: { type: Number, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
}, {
    timestamps: true,
});

export default mongoose.model('Message', MessageSchema);