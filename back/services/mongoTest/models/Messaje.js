import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    idChat: { type: Number, required: true },
    idUser: { type: Number, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});

export default mongoose.model('Message', MessageSchema);