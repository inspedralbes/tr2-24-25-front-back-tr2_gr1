// Cargar configuraciones de entorno
import dotenv from 'dotenv';
dotenv.config();


// Importar dependencias necesarias
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';


// Crear la aplicación Express
const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Variables de entorno
const PORT = process.env.PORT || 3000;


// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tr2-g1',
});


// Verificar la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL!');
});


// GET Endpoint
app.get('/api/associacio', (req, res) => {
  const query = 'SELECT id, nom, descripcio FROM associacio';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).send('Error al obtener las asociaciones');
    }


    // Respuesta exitosa con los registros
    res.status(200).json(results);
  });
});


// **POST Endpoint
app.post('/api/associacio', (req, res) => {
  const { nom, descripcio } = req.body;


  // Validación de entrada
  if (!nom || !descripcio) {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const insertQuery = 'INSERT INTO associacio (nom, descripcio) VALUES (?, ?)';
  connection.query(insertQuery, [nom, descripcio], (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).send('Error al insertar la asociación');
    }


    // Respuesta exitosa con el ID generado
    const createdRecord = {
      id: result.insertId,
      nom,
      descripcio,
    };
    res.status(201).json(createdRecord);
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});