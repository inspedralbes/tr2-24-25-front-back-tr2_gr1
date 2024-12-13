// Cargar configuraciones de entorno
import dotenv from 'dotenv';



// Importar dependencias necesarias
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import fs, { read } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'node:child_process';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

// Crear la aplicación Express
const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// --- SOCKET.IO ---
const server = createServer(app);
const io = new Server(server);

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

// --- ENDPOINTS PER PROPOSTA ---

// GET Endpoint
app.get('/api/proposta', (req, res) => {
  const db = connectToDatabase();
  const query = `
    SELECT 
      p.id,
      p.titol,
      p.subtitol,
      p.contingut,
      p.data,
      p.idAsso,
      u.id AS idUsuari,
      CONCAT(u.nom, ' ', u.cognoms) AS nomUsuari
    FROM PROPOSTA p
    LEFT JOIN USUARI u ON p.autor = u.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving proposals:', err);
      return res.status(500).send('Error retrieving proposals');
    }

    const formattedResults = results.map(proposta => ({
      id: proposta.id,
      titol: proposta.titol,
      subtitol: proposta.subtitol,
      contingut: proposta.contingut,
      autor: {
        idUsuari: proposta.idUsuari,
        nomUsuari: proposta.nomUsuari
      },
      idAsso: proposta.idAsso,
      data: proposta.data
    }));

    res.status(200).json(formattedResults);
  });

  db.end();
});


//GET Endpoint por ID
app.get('/api/proposta/:id', (req, res) => {
  const propostaId = req.params.id;  // Obtener el ID desde la URL
  const db = connectToDatabase();
  
  const query = `
    SELECT 
      p.id,
      p.titol,
      p.subtitol,
      p.contingut,
      p.data,
      p.idAsso,
      u.id AS idUsuari,
      CONCAT(u.nom, ' ', u.cognoms) AS nomUsuari
    FROM PROPOSTA p
    LEFT JOIN USUARI u ON p.autor = u.id
    WHERE p.id = ?;
  `;

  db.query(query, [propostaId], (err, results) => {
    if (err) {
      console.error('Error retrieving proposal:', err);
      return res.status(500).send('Error retrieving proposal');
    }

    if (results.length === 0) {
      // Si no se encuentra la propuesta
      return res.status(404).send('Proposal not found');
    }

    const proposta = results[0];  // Obtener la primera propuesta (ya que el ID es único)
    
    const formattedProposta = {
      id: proposta.id,
      titol: proposta.titol,
      subtitol: proposta.subtitol,
      contingut: proposta.contingut,
      autor: {
        idUsuari: proposta.idUsuari,
        nomUsuari: proposta.nomUsuari
      },
      idAsso: proposta.idAsso,
      data: proposta.data
    };

    res.status(200).json(formattedProposta);
  });

  db.end();
});

// UPDATE Endpoint
app.put('/api/proposta', (req, res) => {
  const { id, titol, subtitol, contingut, autor, idAsso, data } = req.body;

  if (!id || !titol || !subtitol || !contingut || !autor || !idAsso || !data) {
    return res.status(400).json({ description: "Invalid input" });
  }

  const db = connectToDatabase();
  const query = `
    UPDATE PROPOSTA 
    SET titol = ?, subtitol = ?, contingut = ?, autor = ?, idAsso = ?, data = ?
    WHERE id = ?
  `;

  const params = [titol, subtitol, contingut, autor, idAsso, data, id];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating proposal:', err);
      return res.status(500).send('Error updating proposal');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ description: "Proposal not found" });
    }

    const updatedProposal = {
      id,
      titol,
      subtitol,
      contingut,
      autor,
      idAsso,
      data
    };

    res.status(200).json(updatedProposal);
  });

  db.end();
});

//  ----- MICROSERVEIS -----


const services = [];

const __dirname = dirname(fileURLToPath(import.meta.url));
fs.readdirSync(path.join(__dirname, 'services')).forEach(file => {
  services.push({ id: uuidv4(), name: file, state: 'tancat', logs: [], errorLogs: [], process: null });

  try {
    let data = fs.readFileSync(path.join(__dirname, 'logs') + `/${file}.log`, 'utf8');

    let splitData = data.toString().split('||\n');

    splitData.forEach(element => {
      if (element.length === 0) return;
      const parsedElement = JSON.parse(element);

      services.find(service => service.name === file).logs.push(parsedElement);
    });
  } catch (error) {
    console.log(`File not found: ${error}`);
  }

  console.log(services.find(service => service.name === file).logs);

  try {
    let data = fs.readFileSync(path.join(__dirname, 'logs') + `/${file}.error.log`, 'utf8');

    let splitData = data.toString().split('||\n');

    splitData.forEach(element => {
      if (element.length === 0) return;
      const parsedElement = JSON.parse(element);

      services.find(service => service.name === file).errorLogs.push(parsedElement);
    });
  } catch (error) {
    console.log(`File not found: ${error}`);
  }
  // services.push({ id: uuidv4(), name: file, state: 'tancat', logs: [], errorLogs: [], process: null });
});

app.get('/services', (req, res) => {
  res.send(services);
});

app.post('/changeServiceState', (req, res) => {

  console.log(req.body);

  const { id } = req.body

  const service = services.find(service => service.id === id);

  console.log(service);

  if (service.state === 'tancat') {
    startProcess(service);
    service.state = 'encès';
  } else {
    stopProcess(service);
    service.state = 'tancat';
  }

  res.send(services);

});

function startProcess(service) {
  const process = spawn('node', [path.join(__dirname, 'services') + `/${service.name}/index.js`]);

  service.process = process;

  console.log("entering");

  process.stdout.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    console.log(date);
    service.logs.push({ log: data.toString(), date: date });
    console.log("Estàndard: ", { log: data.toString(), date: date });
    saveLogs(service, { log: data.toString(), date: date });
  });

  process.stderr.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    console.log(date);
    service.errorLogs.push({ log: data.toString(), date: date });
    console.log("Error: ", { log: data.toString(), date: date });
    saveErrorLogs(service, { log: data.toString(), date: date });

  });

  process.on('close', code => {
    service.state = 'tancat';
    service.process = null;
    enviarServeis();
  });

  enviarServeis();
}

function stopProcess(service) {
  console.log(process.platform);
  service.process.kill();
  service.process = null;
  service.state = 'tancat';
  enviarServeis();
}

function saveLogs(service, objectToSave) {
  console.log(objectToSave);
  const { log, date } = objectToSave;


  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.log`, JSON.stringify({ log, date }) + "||\n", err => {
    if (err) {
      console.error(err);
    }
  });
}

function saveErrorLogs(service, log) {
  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.error.log`, log, err => {
    if (err) {
      console.error(err);
    }
  });
}

function enviarServeis() {
  io.emit('actualitzar serveis', JSON.stringify(services.map(service => {
    return { id: service.id, name: service.name, state: service.state, logs: service.logs, errorLogs: service.errorLogs };
  })));
}

// --- ENDPOINTS PARA COMENTARIS ---
// GET Endpoint per IDPROP
app.get('/api/comentaris/:idProp', (req, res) => {
  const db = connectToDatabase();
  const { idProp } = req.params;

  console.log(`Fetching comments for proposal ID: ${idProp}`);

  const query = `
    SELECT 
      c.id,
      c.contingut,
      c.actiu,
      u.nom AS autorNom,
      u.cognoms AS autorCognoms
    FROM COMENTARI c
    JOIN USUARI u ON c.autor = u.id
    WHERE c.idProp = ? AND c.actiu = true
    ORDER BY c.id DESC;
  `;

  db.query(query, [idProp], (err, results) => {
    if (err) {
      console.error('Error retrieving comments:', err.message);
      return res.status(500).send(`Error retrieving comments: ${err.message}`);
    }

    console.log('Comments retrieved:', results);

    const formattedResults = results.map(comment => ({
      id: comment.id,
      autor: {
        nomUsuari: `${comment.autorNom} ${comment.autorCognoms}`,
      },
      contingut: comment.contingut,
    }));

    res.status(200).json(formattedResults);
  });

  db.end();
});


// --- ENDPOINTS PARA VOTACIONS ---
// POST Endpoint per IDPROP
app.post('/api/comentaris/:idProp', (req, res) => {
  const db = connectToDatabase();
  const { idProp } = req.params;
  const { contenido } = req.body;

  if (!contenido || contenido.trim() === '') {
    return res.status(400).send('El comentario no puede estar vacío.');
  }

  const query = `
    INSERT INTO COMENTARI (autor, idProp, contingut, actiu) 
    VALUES (?, ?, ?, true)
  `;

  const autorId = 1;

  db.query(query, [autorId, idProp, contenido], (err, results) => {
    if (err) {
      console.error('Error inserting comment:', err);
      return res.status(500).send('Error adding comment');
    }

    const currentDate = new Date().toLocaleString();

    const newComment = {
      id: results.insertId,
      autor: { nomUsuari: 'Tu Nom' },
      contingut: contenido,
      data: currentDate,
    };

    res.status(200).json(newComment);
  });

  db.end();
});


// POST Endpoint 
app.post('/api/votacions', (req, res) => {
  const db = connectToDatabase();
  const { idProp, idUsu, resposta } = req.body;

  if (idProp === undefined || idUsu === undefined || resposta === undefined) {
    db.end();
    return res.status(400).json({ message: 'Faltan datos requeridos: idProp, idUsu, resposta.' });
  }

  const checkVoteQuery = 'SELECT * FROM VOTACIONS WHERE idProp = ? AND idUsu = ?';
  
  db.query(checkVoteQuery, [idProp, idUsu], (err, results) => {
    if (err) {
      console.error('Error al verificar la votación existente:', err);
      db.end();
      return res.status(500).json({ message: 'Error al verificar la votación existente', error: err.message });
    }

    if (results.length > 0) {
      db.end();
      return res.status(400).json({ message: 'Ya has votado para esta propuesta.' });
    }

    const insertVoteQuery = `
      INSERT INTO VOTACIONS (idProp, idUsu, resposta)
      VALUES (?, ?, ?)
    `;
    
    db.query(insertVoteQuery, [idProp, idUsu, resposta], (err, result) => {
      if (err) {
        console.error('Error al registrar la votación:', err);
        db.end();
        return res.status(500).json({ message: 'Error al registrar la votación', error: err.message });
      }

      if (result.affectedRows > 0) {
        db.end();
        return res.status(200).json({ message: 'Votación registrada correctamente.' });
      } else {
        db.end();
        return res.status(500).json({ message: 'No se pudo registrar la votación. Intenta de nuevo.' });
      }
    });
  });
});


// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Server active at port ${PORT}`);
});