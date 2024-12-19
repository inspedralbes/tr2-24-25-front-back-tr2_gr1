import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { createVot, getVotByActUserID } from './routes/vot.js';

const app = express();
const PORT = 3003;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// Configuración de la conexión a la base de datos desde variables de entorno
const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connectat a MongoDB'))
    .catch((err) => console.error('Error al connectar a MongoDB', err));

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

// ** Endpoint de Propuestas **
// p. Significa que agafa les dades de la taula PROPOSTES, es una forma de fer-ho mes curt per no posar el nom tota l'estona.
// Obtener todas las propuestas
app.get('/api/proposta/', (req, res) => {
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

// GET ALL ACTIVITIES FROM AN ASSOCIATION
app.get('/api/activities/:idAsso', (req, res) => {

  const db = connectToDatabase();
  const { idAsso } = req.params;

  console.log(`Fetching activities for association ID: ${idAsso}`);
  // SELECT data, adreca, nom AS titol, descripcio AS subtitol, 'ESDEVENIMENT' AS tipus, '' AS contingut
  // FROM ESDEVENIMENT
  // WHERE idAsso = ? AND data < CURRENT_DATE
  
  // UNION ALL
  const query = `
  SELECT data, color, titol, subtitol, contingut, color
  FROM PROPOSTA
  WHERE idAsso = ? AND data >= CURRENT_DATE;`;

const params=[idAsso, idAsso];

db.query(query, params, (err, results) => {
  if (err) {
    console.error('Error retrieving activities:', err.message);
    return res.status(500).send(`Error retrieving activities: ${err.message}`);
  }

  console.log('Activities retrieved:', results);

  const formattedResults = results.map(activity => ({
    date: activity.data,
    color: activity.color,
    label: activity.titol,
    subtitol: activity.subtitol,
    contingut: activity.contingut,
  }));
  res.status(200).json(formattedResults);
});
});


// POST Endpoint para crear una nueva propuesta
app.post('/api/proposta', (req, res) => {
  const { titol, subtitol, contingut, autor, data, color } = req.body;

  const autorId = autor || 1;
  const associacioId = 1;
  const currentDate = data || new Date().toISOString().split('T')[0];
  const proposalColor = color || '#FFFFFF';

  if (!titol || !subtitol || !contingut) {
    return res.status(400).json({ description: "Invalid input. All fields except autor and idAsso are required." });
  }

  const db = connectToDatabase();

  const query = `
    INSERT INTO PROPOSTA (titol, subtitol, contingut, autor, idAsso, data, color)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  const params = [titol, subtitol, contingut, autorId, associacioId, currentDate, proposalColor];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error creating proposal:', err);
      return res.status(500).send('Error creating proposal');
    }

    const newProposalId = result.insertId;

    const newProposal = {
      id: newProposalId,
      titol,
      subtitol,
      contingut,
      autor: autorId,
      idAsso: associacioId,
      data: currentDate,
      color: proposalColor,
    };

    res.status(201).json(newProposal);
  });

  db.end();
});


// --- ENDPOINTS PARA COMENTARIS ---
// GET Endpoint per IDPROP
// GET Endpoint per IDPROP con sockets
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

// POST Endpoint per IDPROP con sockets
app.post('/api/comentaris/:idProp', (req, res) => {
  const db = connectToDatabase();
  const { idProp } = req.params;
  const { contenido } = req.body;

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Token is required');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid or expired token');
    }

    const autorId = decoded.id;

    if (!contenido || contenido.trim() === '') {
      return res.status(400).send('El comentario no puede estar vacío.');
    }

    const query = `
      INSERT INTO COMENTARI (autor, idProp, contingut, actiu) 
      VALUES (?, ?, ?, true)
    `;

    db.query(query, [autorId, idProp, contenido], (err, results) => {
      if (err) {
        console.error('Error inserting comment:', err);
        return res.status(500).send('Error adding comment');
      }

      const newComment = {
        id: results.insertId,
        autor: { nomUsuari: 'Tu Nom' },
        contingut: contenido,
      };

      io.emit('newComment', { idProp, newComment });

      res.status(200).json(newComment);
    });

    db.end();
  });
});
  

// --- ENDPOINTS PARA VOTACIONS ---
// POST Endpoint 
app.post('/api/votacions', (req, res) => {
  
  // idProp: integer, idUsu: integer, resposta: boolean

  const { idProp, idUsu, resposta } = req.body;

  

  if (idProp === undefined || idUsu === undefined || resposta === undefined) {
    return res.status(400).json({ message: 'Faltan datos requeridos: idProp, idUsu, resposta.' });
  }

  getVotByActUserID(idProp, idUsu).then((result) => {
    if (result.valid) {
      console.log("vot valid");
      createVot({ idProp, idUsu, resposta }).then((result) => {
        res.json(result);
      });
    } else {
      res.json(result);
    }
  });

  // const db = connectToDatabase();

  // const checkVoteQuery = 'SELECT * FROM VOTACIONS WHERE idProp = ? AND idUsu = ?';
  
  // let checkResults = [];

  // db.query(checkVoteQuery, [idProp, idUsu], (err, results) => {
  //   if (err) {
  //     console.error('Error al verificar la votación existente:', err);
  //     db.end();
  //     return res.status(500).json({ message: 'Error al verificar la votación existente', error: err.message });
  //   }

  //   checkResults = results;

  //   db.end();
  // });

    // if (results.length > 0) {
    //   return res.status(400).json({ message: 'Ya has votado para esta propuesta.' });
    // } else {
      
    //   const db = connectToDatabase();

    //   const insertVoteQuery = `
    //     INSERT INTO VOTACIONS (idProp, idUsu, resposta)
    //     VALUES (?, ?, ?)
    //   `;

    //   db.query(insertVoteQuery, [idProp, idUsu, resposta], (err, result) => {
    //     if (err) {
    //       console.error('Error al registrar la votación:', err);
    //       db.end();
    //       return res.status(500).json({ message: 'Error al registrar la votación', error: err.message });
    //     }

    //     if (result.affectedRows > 0) {
    //       // db.end();
    //       return res.status(200).json({ message: 'Votación registrada correctamente.' });
    //     } else {
    //       // db.end();
    //       return res.status(500).json({ message: 'No se pudo registrar la votación. Intenta de nuevo.' });
    //     }
    //   });

    //   db.end();
    // }


});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});