// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import chatRoutes from './routes/chat';

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Habilitar CORS per a qualsevol origen
app.use(fileUpload()); // Habilitar la pujada d'arxius

// Servir arxius estàtics des de la carpeta 'upload'
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api/chat', chatRoutes);

// Connexió a la base de dades MongoDB
mongoose.connect('mongodb+srv://a22arnfergil:a22arnfergil@mongodbtest.i73kd.mongodb.net/motocicletes?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connectat a MongoDB'))
.catch((err) => console.error('Error al connectar a MongoDB', err));



// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});

// Rutes
app.get('/', (req, res) => {
  res.send('Benvingut al servidor de motocicletes');
});