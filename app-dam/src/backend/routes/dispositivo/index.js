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

//ruta Función ultima medición.
routerDispositivo.get('/:id/ultima-medicion', (req, res) => {
    const dispositivoId = req.params.id;
    pool.query(
      'SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC LIMIT 1',
      [dispositivoId],
      (err, results) => {
        if (err) {
          res.status(500).send({ error: 'Error al obtener la última medición' });
        } else if (results.length === 0) {
          res.status(404).send({ mensaje: 'No hay mediciones disponibles' });
        } else {
          res.status(200).send(results[0]);
        }
      }
    );
  });
  
module.exports = routerDispositivo;
