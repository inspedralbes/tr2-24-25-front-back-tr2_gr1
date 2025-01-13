import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { spawn } from 'child_process';

dotenv.config();


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

const fetchAndWriteMessages = async () => {
    try {
        const messages = await Message.find();
        fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
        console.log('Messages written to messages.json');

        const pythonProcess = spawn('python', ['chatStats.py']);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        pythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    } catch (err) {
        console.error('Error retrieving items:', err);
    }
};

setInterval(fetchAndWriteMessages, 60000);