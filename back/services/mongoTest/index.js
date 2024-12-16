// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import chatRoutes from '../chat/routes/chat.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';



const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Habilitar CORS per a qualsevol origen
app.use(fileUpload()); // Habilitar la pujada d'arxius

// Servir arxius estàtics des de la carpeta 'upload'
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api/chat', chatRoutes);

// Connexió a la base de dades MongoDB
mongoose.connect('mongodb://root:example@localhost:27017/')
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));



// Iniciar el servidor
// const PORT = process.env.PORT || 3002;
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});

// Rutes
app.get('/', (req, res) => {
  res.send('Benvingut al servidor de motocicletes');
});