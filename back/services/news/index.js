import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';
import mysql2 from 'mysql2';
import { verifyTokenMiddleware } from '../../tokens.js';

// Configurar dotenv
dotenv.config();

const app = express();
const PORT = process.env.NEWS_PORT;

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

const db = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    charset: 'utf8' 
});

let news = [];

app.get('/api/noticia/:id', verifyTokenMiddleware, (req, res) => {
    const id = req.params.id;
    try {
        const queryNoticia = 'SELECT id, titol, subtitol, contingut, autor, idAsso FROM NOTICIA WHERE idAsso = ?';
        db.query(queryNoticia, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener las noticias:', err);
                return res.status(500).send('Error al obtener las noticias');
            }

            if (result.length === 0) {
                console.log(`No se encontraron noticias para la asociación con id ${id}`);
                return res.status(404).json({ message: `No se encontraron noticias para la asociación con idAsso ${id}` });
            }

            console.log(`Noticias encontradas para la asociación ${id}:`, result);
            res.json(result);
        });
    } catch (err) {
        console.error('Error al obtener las noticias:', err);
        res.status(500).send('Error al obtener las noticias', err);
    }
});

app.get('/api/noticia/:id', verifyTokenMiddleware, (req, res) => {
    try {
        const id = req.params.id;
        const query = `SELECT id, titol, subtitol, contingut, autor, idAsso FROM NOTICIA WHERE id = ${id}`;
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error al obtenir la notícia:', err);
                res.status(500).send('Error al obtenir la notícia');
                return;
            }
            res.json(result[0]);
        });
    } catch (err) {
        console.error('Error al obtenir la notícia:', err);
        res.status(500).send('Error al obtenir la notícia');
    }
});

app.post('/api/noticia', verifyTokenMiddleware, (req, res) => {
    const { titol, subtitol, contingut, autor, idAsso } = req.body;

    const validateAuthorQuery = `SELECT id FROM USUARI WHERE id = '${autor}'`;
    db.query(validateAuthorQuery, (err, result) => {
        if (err) {
            console.error('Error al validar el autor:', err);
            return res.status(500).send('Error al validar el autor');
        }

        if (result.length === 0) {
            return res.status(400).send('El autor no existe en la base de datos');
        }

        const insertQuery = `INSERT INTO NOTICIA (titol, subtitol, contingut, autor, idAsso) VALUES ('${titol}', '${subtitol}', '${contingut}', '${autor}', ${idAsso})`;
        db.query(insertQuery, (err, result) => {
            if (err) {
                console.error('Error al crear la notícia:', err);
                return res.status(500).send('Error al crear la notícia');
            }

            // Respuesta personalizada
            res.json({
                message: 'Notícia creada correctament',
                noticiaId: result.insertId,
            });
        });
    });
});

app.put('/api/noticia/:id', verifyTokenMiddleware, (req, res) => {
    const id = req.params.id; // ID de la noticia a editar
    const { titol, subtitol, contingut, autor, idAsso } = req.body;

    // Validar que el autor existe antes de actualizar la noticia
    const validateAuthorQuery = `SELECT id FROM USUARI WHERE id = '${autor}'`;
    db.query(validateAuthorQuery, (err, result) => {
        if (err) {
            console.error('Error al validar el autor:', err);
            return res.status(500).send('Error al validar el autor');
        }

        if (result.length === 0) {
            return res.status(400).send('El autor no existe en la base de datos');
        }

        // Actualizar los campos de la noticia
        const updateQuery = `
            UPDATE NOTICIA 
            SET 
                titol = ?, 
                subtitol = ?, 
                contingut = ?, 
                autor = ?, 
                idAsso = ? 
            WHERE id = ?
        `;

        const values = [titol, subtitol, contingut, autor, idAsso, id];

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error('Error al editar la notícia:', err);
                return res.status(500).send('Error al editar la notícia');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('No se encontró la notícia con el ID proporcionado');
            }

            // Respuesta personalizada
            res.json({
                message: 'Notícia editada correctament',
                noticiaId: id,
            });
        });
    });
});

app.delete('/api/noticia/:id', verifyTokenMiddleware, (req, res) => {
    const id = req.params.id;

    const deleteQuery = `DELETE FROM NOTICIA WHERE id = ${id}`;
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error('Error al eliminar la notícia:', err);
            return res.status(500).send('Error al eliminar la notícia');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('No se encontró la notícia con el ID proporcionado');
        }

        // Respuesta personalizada
        res.json({
            message: 'Notícia eliminada correctament',
            noticiaId: id,
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});