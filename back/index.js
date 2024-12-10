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


console.log(process.env.MYSQL_USER);

// Configuración de la conexión a la base de datos desde variables de entorno
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

function connectToDatabase() {
  const connection = mysql.createConnection(connectionConfig);
  return connection;
}

// Verificar la conexión a la base de datos
const connection = connectToDatabase();

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
  const db = connectToDatabase();
  const query = 'SELECT id, nom, descripcio FROM ASSOCIACIO';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Associacio not found', err);
      return res.status(500).send('Associacio not found');
    }

    // Respuesta exitosa con los registros
    res.status(200).json(results);
  });
  db.end();
});

// POST Endpoint
app.post('/api/associacio', (req, res) => {
  const db = connectToDatabase();
  const { nom, descripcio } = req.body;

  console.log(nom)
  
  console.log(descripcio)

  // Validación de entrada
  if (!nom || !descripcio) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const insertQuery = 'INSERT INTO ASSOCIACIO (nom, descripcio) VALUES (?, ?)';
  db.query(insertQuery, [nom, descripcio], (err, result) => {
    if (err) {
      console.error('Error creating associacio', err);
      return res.status(500).send('Error creating associacio');
    }

    // Respuesta exitosa con el ID generado
    const createdRecord = {
      id: result.insertId,
      nom,
      descripcio,
    };
    res.status(201).json(createdRecord);
  });
  db.end();
});

// DELETE Endpoint
app.delete('/api/associacio', (req, res) => {
  const db = connectToDatabase();
  const { id } = req.body;

  // Validación de entrada
  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const deleteQuery = 'DELETE FROM ASSOCIACIO WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting associacio', err);
      return res.status(500).send('Error deleting associacio');
    }

    // Verificar si se eliminó un registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Associacio not found' });
    }

    // Respuesta exitosa
    res.status(200).json({ message: 'Associacio deleted successfully' });
  });
  db.end();
});

// PUT Endpoint
app.put('/api/associacio', (req, res) => {
  const db = connectToDatabase();
  const { id, nom, descripcio } = req.body;

  // Validación de entrada
  if (!id || !nom || !descripcio) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const updateQuery = 'UPDATE ASSOCIACIO SET nom = ?, descripcio = ? WHERE id = ?';
  db.query(updateQuery, [nom, descripcio, id], (err, result) => {
    if (err) {
      console.error('Error updating associacio', err);
      return res.status(500).send('Error updating associacio');
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
  db.end();
});

// --- ENDPOINTS PARA USUARI ---
// GET Endpoint
app.get('/api/usuari', (req, res) => {
  const db = connectToDatabase();
  const query = 'SELECT id, nom, cognoms, contrasenya, correu, imatge, permisos FROM USUARI';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Users not found', err);
      return res.status(500).send('Users not found');
    }

    // Respuesta exitosa con los registros
    res.status(200).json(results);
  });
  db.end();
});

// POST Endpoint
app.post('/api/usuari', (req, res) => {
  const db = connectToDatabase();
  const { nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;

  // Validación de entrada
  if (!nom || !cognoms || !contrasenya || !correu || !imatge || !permisos) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const insertQuery = 'INSERT INTO USUARI (nom, cognoms, contrasenya, correu, imatge, permisos) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [nom, cognoms, contrasenya, correu, imatge, permisos], (err, result) => {
    if (err) {
      console.error('Invalid input', err);
      return res.status(500).send('Invalid input');
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
  db.end();
});

// DELETE Endpoint
app.delete('/api/usuari', (req, res) => {
  const db = connectToDatabase();
  const { id } = req.body;

  // Validación de entrada
  if (!id || typeof id !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const deleteQuery = 'DELETE FROM USUARI WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user', err);
      return res.status(500).send('Error deleting user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
  db.end();
});

// PUT Endpoint
app.put('/api/usuari', (req, res) => {
  const db = connectToDatabase();
  const { id, nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;

  // Validación de entrada
  if (!id || !nom || !cognoms || !contrasenya || !correu || !imatge || !permisos) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const updateQuery = 'UPDATE USUARI SET nom = ?, cognoms = ?, contrasenya = ?, correu = ?, imatge = ?, permisos = ? WHERE id = ?';
  db.query(updateQuery, [nom, cognoms, contrasenya, correu, imatge, permisos, id], (err, result) => {
    if (err) {
      console.error('Error updating user', err);
      return res.status(500).send('Error updating user');
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
  db.end();
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server active at port ${PORT}`);
});