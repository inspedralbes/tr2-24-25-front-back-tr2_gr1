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


// --- ENDPOINTS PARA ASSOCIACIO ---
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


// POST Endpoint
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


// DELETE Endpoint
app.delete('/api/associacio', (req, res) => {
  const { id } = req.body;


  // Validación de entrada
  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const deleteQuery = 'DELETE FROM associacio WHERE id = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la asociación:', err);
      return res.status(500).send('Error al eliminar la asociación');
    }


    // Verificar si se eliminó un registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Associacio not found' });
    }


    // Respuesta exitosa
    res.status(200).json({ message: 'Associacio deleted successfully' });
  });
});


// PUT Endpoint
app.put('/api/associacio', (req, res) => {
  const { id, nom, descripcio } = req.body;


  // Validación de entrada
  if (!id || !nom || !descripcio) {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const updateQuery = 'UPDATE associacio SET nom = ?, descripcio = ? WHERE id = ?';
  connection.query(updateQuery, [nom, descripcio, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la asociación:', err);
      return res.status(500).send('Error al actualizar la asociación');
    }


    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Associacio not found' });
    }


    // Respuesta exitosa con los datos actualizados
    const updatedRecord = {
      id,
      nom,
      descripcio,
    };
    res.status(200).json(updatedRecord);
  });
});


// --- ENDPOINTS PARA USUARI ---
// GET Endpoint
app.get('/api/usuari', (req, res) => {
  const query = 'SELECT id, nom, cognoms, contrasenya, correu, imatge, permisos FROM usuari';


  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).send('Error al obtener los usuarios');
    }


    // Respuesta exitosa con los registros
    res.status(200).json(results);
  });
});


// POST Endpoint
app.post('/api/usuari', (req, res) => {
  const { nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;


  // Validación de entrada
  if (!nom || !cognoms || !contrasenya || !correu || !imatge || !permisos) {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const insertQuery = 'INSERT INTO usuari (nom, cognoms, contrasenya, correu, imatge, permisos) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(insertQuery, [nom, cognoms, contrasenya, correu, imatge, permisos], (err, result) => {
    if (err) {
      console.error('Error al crear el usuario:', err);
      return res.status(500).send('Error al crear el usuario');
    }


    // Respuesta exitosa con el ID generado
    const createdUser = {
      id: result.insertId,
      nom,
      cognoms,
      contrasenya,
      correu,
      imatge,
      permisos,
    };
    res.status(201).json(createdUser);
  });
});


// DELETE Endpoint
app.delete('/api/usuari', (req, res) => {
  const { id } = req.body;


  // Validación de entrada
  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const deleteQuery = 'DELETE FROM usuari WHERE id = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      return res.status(500).send('Error al eliminar el usuario');
    }


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }


    res.status(200).json({ message: 'User deleted successfully' });
  });
});


// PUT Endpoint
app.put('/api/usuari', (req, res) => {
  const { id, nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;


  // Validación de entrada
  if (!id || !nom || !cognoms || !contrasenya || !correu || !imatge || !permisos) {
    return res.status(400).json({ message: 'Invalid input' });
  }


  const updateQuery = 'UPDATE usuari SET nom = ?, cognoms = ?, contrasenya = ?, correu = ?, imatge = ?, permisos = ? WHERE id = ?';
  connection.query(updateQuery, [nom, cognoms, contrasenya, correu, imatge, permisos, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).send('Error al actualizar el usuario');
    }


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }


    const updatedUser = {
      id,
      nom,
      cognoms,
      contrasenya,
      correu,
      imatge,
      permisos,
    };


    res.status(200).json(updatedUser);
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});