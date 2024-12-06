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

  //Simulación con match.random 
  const SimulacionMedicion = {
    dispositivoId: dispositivoId,
    humedad: Math.floor(Math.random() * (100 - 10 + 1)) + 10, // Genero la condición entre el rango de 0 a 100
    fecha: new Date().toISOString(), // Obtengo la fecha que me servirá par aguardar este dato
  };

  console.log('Test medir random:', SimulacionMedicion); // Log para verificar
  res.status(200).send(SimulacionMedicion);
});

// Ruta para obtener el historial de mediciones del dispositivo
routerDispositivo.get('/:id/historial-mediciones', (req, res) => {
  const dispositivoId = req.params.id;

  // Consulta para obtener el historial de mediciones del dispositivo
  pool.query(
    'SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC',
    [dispositivoId],
    (err, results) => {
      if (err) {
        console.error('Error al obtener el historial de mediciones:', err);
        res.status(500).send({ error: 'Error al obtener el historial de mediciones' });
      } else {
        res.status(200).send(results);
      }
    }
  );
});


  
module.exports = routerDispositivo;
