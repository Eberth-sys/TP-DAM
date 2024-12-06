const express = require('express');
const routerDispositivo = express.Router();
const pool = require('../../mysql-connector'); // Conexión a MySQL
const { procesarFecha } = require('../../utils/fecha'); //import el pipeline de fecha

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

//Función para simular una medicion aleatoria con Math.random.

function MedicionAleatoria(dispositivoId) {
  const fechaactual = new Date();
  return {
    dispositivoId: dispositivoId,
    humedad: Math.floor(Math.random() * (100 - 10 + 1)) + 10, // Genero la condición entre el rango de 0 a 100
    fecha: procesarFecha(fechaactual), // Obtengo la fecha que me servirá par aguardar este dato
  };
}

// Función para convertir `pool.query` a promesas
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

//ruta Función ultima medición.
routerDispositivo.get('/:id/ultima-medicion', (req, res) => {
  const dispositivoId = req.params.id;

  // Traigo el valor de la funcion MedicionAleatoria
  const SimulacionMedicion = MedicionAleatoria(dispositivoId);

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
routerDispositivo.post('/:id/accion-valvula', async (req, res) => {
  const dispositivoId = req.params.id;
  const { accion } = req.body;

  const apertura = accion === 'Abierta' ? 1 : accion === 'Cerrada' ? 0 : null;

  if (apertura === null) {
    return res.status(400).send({ error: 'Debe ser "Abierta" o "Cerrada".' });
  }

  try {
    const dispositivos = await queryAsync('SELECT * FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId]);
    if (dispositivos.length === 0) {
      return res.status(404).send({ error: 'Dispositivo no encontrado.' });
    }

    const electrovalvulaId = dispositivos[0].electrovalvulaId;
    const medicion = MedicionAleatoria(dispositivoId);

    console.log('Intentando registrar medición:', medicion);

    await queryAsync('INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?)', [
      medicion.fecha,
      medicion.humedad,
      dispositivoId,
    ]);

    console.log('Medición registrada con éxito.');

    await queryAsync('INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, NOW(), ?)', [
      apertura,
      electrovalvulaId,
    ]);

    res.status(200).send({
      message: `Válvula ${accion} registrada exitosamente.`,
      humedad: medicion.humedad,
    });
  } catch (error) {
    console.error('Error interno al accionar la válvula:', error.message);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});


module.exports = routerDispositivo;