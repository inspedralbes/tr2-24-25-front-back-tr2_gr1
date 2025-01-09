import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3005;

app.use(express.json());

console.log('MONGO_URL:', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connectat a MongoDB'))
    .catch((err) => console.error('Error al connectar a MongoDB', err));

const messageSchema = new mongoose.Schema({
    idAsso: { type: Number, required: true },
    idUser: { type: Number, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
        res.json(messages);
    } catch (err) {
        console.error('Error retrieving items:', err);
        res.status(500).send('Error retrieving items');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});