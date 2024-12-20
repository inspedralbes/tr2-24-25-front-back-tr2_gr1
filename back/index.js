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
import bcrypt from 'bcryptjs';
dotenv.config();
import { login, verifyToken } from './tokens.js';

try {



async function hashPassword(contrasenya) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasenya, salt);
  return hashedPassword
}
// Crear la aplicación Express
const app = express();
const router = express.Router();


// Middleware
app.use(cors());
app.use(express.json());


// --- SOCKET.IO ---
const server = createServer(app);
const io = new Server(server);

// Variables de entorno
const PORT = process.env.ROOT_PORT;
const SECRET_KEY = process.env.SECRET_KEY;


console.log(process.env.MYSQL_USER);

// Configuración de la conexión a la base de datos desde variables de entorno
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

function connectToDatabase() {

  try {

    const connection = mysql.createConnection(connectionConfig);
    return connection;

  } catch (e) {
    console.log(e.stack);
  }
}


// Verificar la conexión a la base de datos
//const connection = connectToDatabase();

// connection.connect((err) => {
//   if (err) {
//     console.error('Error conectando a MySQL:', err);
//     process.exit(1);
//   } else {
//     console.log('Conectado a MySQL!');
//     connection.end();
//     console.log("conexion cerrada");
//   }
// });

function verifyTokenMiddleware(req, res, next) {
  const verificacio = verifyToken(SECRET_KEY, req);
  console.log(verificacio.message);
  if (verificacio.status === 401) {
    return res.status(401).json(verificacio);
  }
  next();
}
// --- ENDPOINTS PARA ASSOCIACIO ---
// GET Endpoint
app.get('/api/associacio', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.post('/api/associacio', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.delete('/api/associacio', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.put('/api/associacio', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.get('/api/usuari', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.post('/api/usuari', async (req, res) => {
  console.log("pidiendo")
  const db = connectToDatabase();
  const { nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;

  // Validación de entrada
  if (!nom || !cognoms || !contrasenya || !correu || !imatge || !permisos) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const checkQuery = 'SELECT * FROM USUARI WHERE correu = ?';
  db.query(checkQuery, [correu], async (err, results) => {
    if (err) {
      console.error('Error checking user', err);
      db.end();
      return res.status(500).send('Error checking user');
    }

    if (results.length > 0) {
      db.end();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    let hashedPassword = await hashPassword(contrasenya);
    console.log(hashedPassword);
    const insertQuery = 'INSERT INTO USUARI (nom, cognoms, contrasenya, correu, imatge, permisos) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [nom, cognoms, hashedPassword, correu, imatge, permisos], (err, result) => {
      if (err) {
        console.error('Invalid input', err);
        db.end();
        return res.status(500).send('Invalid input');
      }

      // Respuesta exitosa con el ID generado
      const createdUser = {
        id: result.insertId,
        nom,
        cognoms,
        hashedPassword,
        correu,
        imatge,
        permisos,
      };
      db.end();
      res.status(201).json(createdUser);
    });
  });
});

// DELETE Endpoint
app.delete('/api/usuari', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
app.put('/api/usuari', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
  const db = connectToDatabase();
  const { id, nom, cognoms, contrasenya, correu, imatge, permisos } = req.body;
  console.log(req.body);
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
app.get('/api/proposta', verifyTokenMiddleware, (req, res) => {
  console.log("pidiendo")
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
      console.error('Error retrieving proposals: ', err);
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

// UPDATE Endpoint
app.put('/api/proposta', verifyTokenMiddleware, (req, res) => {
  const { id, titol, subtitol, contingut, autor, idAsso, data } = req.body;

  if (!id || !titol || !subtitol || !contingut || !autor || !idAsso || !data) {
    return res.status(400).json({ description: "Invalid input" });
  }

  console.log("pidiendo")
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


  const { id } = req.body

  const service = services.find(service => service.id === id);

  if (service.state === 'tancat') {
    startProcess(service);
    service.state = 'encès';
  } else {
    stopProcess(service);
    service.state = 'tancat';
  }

  res.send(services);

});

// --- ENDPOINTS PER ACTIVITIES ---
app.get('/api/activities', verifyTokenMiddleware, (req, res) => {
  let data = [
    {
      id: 1,
      date: new Date(2025, 0, 1),
      label: "New Year",
      content: "Happy New Year!",
      link: "https://www.google.com",
      color: "red",
    },
    {
      id: 2,
      date: new Date(2025, 0, 1),
      label: "Valentine's Day",
      content: "Happy Valentine's Day!",
      link: "https://www.google.com",
      color: "purple",
    },
    {
      id: 3,
      date: new Date(2025, 0, 2),
      label: "International Women's Day",
      content: "Happy International Women's Day!",
      link: "https://www.google.com",
      color: "green",
    },
  ];
  res.status(200).json(data);

})// --- Login ENDPOINT ---
app.post('/api/login', login(SECRET_KEY));

app.post('/asignaUsuariAssociacio', (req, res) => {
  const { idUsu, idAsso } = req.body;
  console.log("pidiendo")
  const db = connectToDatabase();

  // Validación de entrada
  if (!idUsu || !idAsso) {
    return res.status(400).json({ message: 'Falten paràmetres' });
  }

  // // Conexión a la base de datos
  // db.connect((err) => {
  //   if (err) {
  //     console.error('Error connecting to the database', err);
  //     return res.status(500).json({ message: 'Error connecting to the database' });
  //   }

    // Consulta para insertar la asignación
    const query = 'INSERT INTO usuari_associacio (idUsu, idAsso) VALUES (?, ?)';
    db.query(query, [idUsu, idAsso], (err, result) => {
      db.end(); // Cerrar la conexión

      if (err) {
        console.error('Error al associar usuari:', err);
        return res.status(500).json({ message: 'Error del servidor al asociar usuari' });
      }

      // Respuesta exitosa
      const createdAssociation = {
        idUsu,
        idAsso,
        associacioId: result.insertId, // ID de la nueva relación generada
      };
      res.status(201).json(createdAssociation); // Enviar el resultado con el nuevo ID
    });
  // });
});

// Endpoint prova. Si el token ha expirat enviem un login: true i fem /login automàticament per generar nou token
app.get('/prova', (req, res) => {
  const verificacio = verifyToken(SECRET_KEY, req);
  if (verificacio.status === 401) {
    res.status(401).json(verificacio);
  } else {
    res.status(200).json(verificacio);
  };
});

function startProcess(service) {
  const process = spawn('node', [path.join(__dirname, 'services') + `/${service.name}/index.js`], {
    cwd: path.join(__dirname, 'services') + `/${service.name}`,
  });

  service.process = process;

  process.stdout.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    service.logs.push({ log: data.toString(), date: date });
    saveLogs(service, { log: data.toString(), date: date });
  });

  process.stderr.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    service.errorLogs.push({ log: data.toString(), date: date });
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
  service.process.kill();
  service.process = null;
  service.state = 'tancat';
  enviarServeis();
}

function saveLogs(service, objectToSave) {
  const { log, date } = objectToSave;

  fs.existsSync(path.join(__dirname, 'logs')) || fs.mkdirSync(path.join(__dirname, 'logs'));

  fs.existsSync(path.join(__dirname, 'logs') + `/${service.name}.log`) || fs.writeFileSync(path.join(__dirname, 'logs') + `/${service.name}.log`, '');

  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.log`, JSON.stringify({ log, date }) + "||\n", err => {
    if (err) {
      console.error(err);
    }
  });
}

function saveErrorLogs(service, objectToSave) {
  const { log, date } = objectToSave;

  fs.existsSync(path.join(__dirname, 'logs')) || fs.mkdirSync(path.join(__dirname, 'logs'));

  fs.existsSync(path.join(__dirname, 'logs') + `/${service.name}.error.log`) || fs.writeFileSync(path.join(__dirname, 'logs') + `/${service.name}.error.log`, '');

  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.error.log`, JSON.stringify({ log, date }) + "||\n", err => {
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


server.listen(PORT, () => {
  console.log(`Server active at port ${PORT}`);
});

} catch (e) {
  console.log("LO TENEMOS");
  console.log(e.stack);
}