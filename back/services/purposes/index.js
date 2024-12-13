import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import mysql from 'mysql';

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

// Crear la conexión a la base de datos MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tr2-g1',
});

// ** Endpoint de Propuestas **

// Obtener todas las propuestas
app.get('/api/proposta', (req, res) => {
    try {
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
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error al obtener las propuestas:', err);
                res.status(500).send('Error al obtener las propuestas');
                return;
            }

            const formattedResult = result.map(proposta => ({
                id: proposta.id,
                titol: proposta.titol,
                subtitol: proposta.subtitol,
                contingut: proposta.contingut,
                autor: {
                    idUsuari: proposta.idUsuari,
                    nomUsuari: proposta.nomUsuari,
                },
                idAsso: proposta.idAsso,
                data: proposta.data,
            }));

            res.json(formattedResult);
        });
    } catch (err) {
        console.error('Error al obtener las propuestas:', err);
        res.status(500).send('Error al obtener las propuestas');
    }
});

// Obtener una propuesta por ID
app.get('/api/proposta/:id', (req, res) => {
    try {
        const id = req.params.id;
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
            WHERE p.id = ?
        `;
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener la propuesta:', err);
                res.status(500).send('Error al obtener la propuesta');
                return;
            }

            if (result.length === 0) {
                return res.status(404).send('Propuesta no encontrada');
            }

            const proposta = result[0];
            res.json({
                id: proposta.id,
                titol: proposta.titol,
                subtitol: proposta.subtitol,
                contingut: proposta.contingut,
                autor: {
                    idUsuari: proposta.idUsuari,
                    nomUsuari: proposta.nomUsuari,
                },
                idAsso: proposta.idAsso,
                data: proposta.data,
            });
        });
    } catch (err) {
        console.error('Error al obtener la propuesta:', err);
        res.status(500).send('Error al obtener la propuesta');
    }
});

// Crear una nueva propuesta
app.post('/api/proposta', (req, res) => {
    const { titol, subtitol, contingut, autor, idAsso, data } = req.body;

    const insertQuery = `
        INSERT INTO PROPOSTA (titol, subtitol, contingut, autor, idAsso, data)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [titol, subtitol, contingut, autor, idAsso, data], (err, result) => {
        if (err) {
            console.error('Error al crear la propuesta:', err);
            return res.status(500).send('Error al crear la propuesta');
        }

        res.json({
            message: 'Propuesta creada correctamente',
            propostaId: result.insertId,
        });
    });
});

// Actualizar una propuesta
app.put('/api/proposta/:id', (req, res) => {
    const { titol, subtitol, contingut, autor, idAsso, data } = req.body;
    const id = req.params.id;

    const updateQuery = `
        UPDATE PROPOSTA 
        SET titol = ?, subtitol = ?, contingut = ?, autor = ?, idAsso = ?, data = ? 
        WHERE id = ?
    `;

    db.query(updateQuery, [titol, subtitol, contingut, autor, idAsso, data, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la propuesta:', err);
            return res.status(500).send('Error al actualizar la propuesta');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Propuesta no encontrada');
        }

        res.json({
            message: 'Propuesta actualizada correctamente',
            propostaId: id,
        });
    });
});

// ** Endpoint de Comentarios **

// Obtener comentarios de una propuesta
app.get('/api/comentaris/:idProp', (req, res) => {
    const { idProp } = req.params;
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
        ORDER BY c.id DESC
    `;

    db.query(query, [idProp], (err, result) => {
        if (err) {
            console.error('Error al obtener los comentarios:', err);
            return res.status(500).send('Error al obtener los comentarios');
        }

        const formattedComments = result.map(comment => ({
            id: comment.id,
            autor: {
                nomUsuari: `${comment.autorNom} ${comment.autorCognoms}`,
            },
            contingut: comment.contingut,
        }));

        res.json(formattedComments);
    });
});

// Crear un comentario
app.post('/api/comentaris/:idProp', (req, res) => {
    const { idProp } = req.params;
    const { contenido } = req.body;

    if (!contenido || contenido.trim() === '') {
        return res.status(400).send('El comentario no puede estar vacío');
    }

    const insertQuery = `
        INSERT INTO COMENTARI (autor, idProp, contingut, actiu) 
        VALUES (?, ?, ?, true)
    `;

    const autorId = 1; // Autor fijo, asumiendo que el autor es el usuario con ID 1

    db.query(insertQuery, [autorId, idProp, contenido], (err, result) => {
        if (err) {
            console.error('Error al crear el comentario:', err);
            return res.status(500).send('Error al crear el comentario');
        }

        res.json({
            message: 'Comentario creado correctamente',
            comentarioId: result.insertId,
        });
    });
});

// ** Endpoint de Votaciones **

// Crear una votación
app.post('/api/votacions', (req, res) => {
    const { idProp, idUsu, resposta } = req.body;

    if (idProp === undefined || idUsu === undefined || resposta === undefined) {
        return res.status(400).json({ message: 'Faltan datos requeridos: idProp, idUsu, resposta.' });
    }

    const checkVoteQuery = 'SELECT * FROM VOTACIONS WHERE idProp = ? AND idUsu = ?';

    db.query(checkVoteQuery, [idProp, idUsu], (err, results) => {
        if (err) {
            console.error('Error al verificar la votación existente:', err);
            return res.status(500).json({ message: 'Error al verificar la votación existente', error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Ya has votado para esta propuesta.' });
        }

        const insertVoteQuery = `
            INSERT INTO VOTACIONS (idProp, idUsu, resposta)
            VALUES (?, ?, ?)
        `;

        db.query(insertVoteQuery, [idProp, idUsu, respuesta], (err, result) => {
            if (err) {
                console.error('Error al registrar la votación:', err);
                return res.status(500).json({ message: 'Error al registrar la votación', error: err.message });
            }

            res.json({
                message: 'Votación registrada correctamente',
                votacionId: result.insertId,
            });
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});