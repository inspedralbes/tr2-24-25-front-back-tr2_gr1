import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';
import mysql from 'mysql';

const app = express();
const PORT = 3002;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow requests from this origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tr2-g1',
});


let news = [];

app.get('/api/noticia', (req, res) => {
    try {
        const query = 'SELECT id, titol, subtitol, contingut, imatge, autor, idAsso FROM noticia';
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error al obtenir les notícies:', err);
                res.status(500).send('Error al obtenir les notícies');
                return;
            }
            news = result;
            res.json(news);
        });
    } catch (err) {
        console.error('Error al obtenir les notícies:', err);
        res.status(500).send('Error al obtenir les notícies');
    }
});

app.get('/api/noticia/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `SELECT id, titol, subtitol, contingut, imatge, autor, idAsso FROM noticia WHERE id = ${id}`;
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

app.post('/api/noticia', (req, res) => {
    const { titol, subtitol, contingut, imatge, autor, idAsso } = req.body;

    const validateAuthorQuery = `SELECT id FROM usuari WHERE id = '${autor}'`;
    db.query(validateAuthorQuery, (err, result) => {
        if (err) {
            console.error('Error al validar el autor:', err);
            return res.status(500).send('Error al validar el autor');
        }

        if (result.length === 0) {
            return res.status(400).send('El autor no existe en la base de datos');
        }

        const insertQuery = `INSERT INTO noticia (titol, subtitol, contingut, imatge, autor, idAsso) VALUES ('${titol}', '${subtitol}', '${contingut}', '${imatge}', '${autor}', ${idAsso})`;
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

app.put('/api/noticia/:id', (req, res) => {
    const id = req.params.id; // ID de la noticia a editar
    const { titol, subtitol, contingut, imatge, autor, idAsso } = req.body;

    // Validar que el autor existe antes de actualizar la noticia
    const validateAuthorQuery = `SELECT id FROM usuari WHERE id = '${autor}'`;
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
            UPDATE noticia 
            SET 
                titol = ?, 
                subtitol = ?, 
                contingut = ?, 
                imatge = ?, 
                autor = ?, 
                idAsso = ? 
            WHERE id = ?
        `;

        const values = [titol, subtitol, contingut, imatge, autor, idAsso, id];

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

app.delete('/api/noticia/:id', (req, res) => {
    const id = req.params.id;

    const deleteQuery = `DELETE FROM noticia WHERE id = ${id}`;
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