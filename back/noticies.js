const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());


// Endpoint para ejecutar el comando
app.post('/runCommand', (req, res) => {
    const command = 'ls'; // Comando que quieres ejecutar
    const args = ['-lh']; // Argumentos para el comando

    const process = spawn(command, args);

    let output = '';
    let errorOutput = '';

    // Capturamos la salida estándar (stdout)
    process.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Capturamos errores (stderr)
    process.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // Cuando el proceso termina
    process.on('close', (code) => {
        if (code === 0) {
            res.status(200).json({ success: true, output });
        } else {
            res.status(500).json({ success: false, error: errorOutput });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
