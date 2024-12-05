const express = require('express');
const routerDispositivo = express.Router();
const pool = require('../../mysql-connector'); // Conexión a MySQL

// Ruta GET para obtener todos los dispositivos
routerDispositivo.get('/', (req, res) => {
    pool.query('SELECT * FROM Dispositivos', (err, result) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err); // Log del error
            res.status(500).send({ mensaje: 'Ocurrió un error al obtener los dispositivos' });
            return;
        }

        if (result.length === 0) {
            res.status(404).send({ mensaje: 'No se encontraron dispositivos' });
            return;
        }

        res.send(result); // Enviar los resultados si todo está bien
    });
});

module.exports = routerDispositivo;
