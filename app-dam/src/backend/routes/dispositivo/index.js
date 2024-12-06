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

//ruta control de valvula
routerDispositivo.post('/:id/accion-valvula', (req, res) => {
  const dispositivoId = req.params.id; // ID del dispositivo
  const { accion } = req.body; // Campo recibido desde el frontend

  // Convertir 'abrir' y 'cerrar' a valores numéricos para apertura
  const apertura = accion === 'Abierta' ? 1 : accion === 'Cerrada' ? 0 : null;

  if (apertura === null) {
    return res.status(400).send({ error: 'Acción inválida. Debe ser "abrir" o "cerrar".' });
  }

  // Paso 1: Buscar el dispositivo en la base de datos
  pool.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId], (err, dispositivo) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send({ error: 'Error interno del servidor al buscar el dispositivo' });
    }

    if (dispositivo.length === 0) {
      return res.status(404).send({ error: 'Dispositivo no encontrado' });
    }

    const electrovalvulaId = dispositivo[0].electrovalvulaId;

    // Paso 2: Insertar el log del riego en la tabla Log_Riegos
    pool.query(
      'INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, NOW(), ?)',
      [apertura, electrovalvulaId],
      (err, result) => {
        if (err) {
          console.error('Error al insertar el log del riego:', err);
          return res.status(500).send({ error: 'Error interno del servidor al registrar el log' });
        }

        res.status(200).send({ message: `Válvula ${accion} exitosamente.` });
      }
    );
  });
});




  
module.exports = routerDispositivo;