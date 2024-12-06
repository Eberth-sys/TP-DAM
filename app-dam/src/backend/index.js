//=======[ Settings, Imports & Data ]==========================================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importar body-parser

var pool = require('./mysql-connector');
const app = express();
const PORT = 3000;

// Middleware 
app.use(express.json()); // Habilitar parsing de JSON en requests
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Importar rutas 
const routerDispositivo = require('./routes/dispositivo'); // Ruta a /routes/dispositivo

// Registrar rutas
app.use('/dispositivo', routerDispositivo);
app.use(bodyParser.json()); // Habilitar JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Habilitar URL-encoded parsing

//=======[ Main module code ]==================================================

// Ruta raíz 
app.get('/', (req, res) => {
    res.status(200).send({ mensaje: 'Hola DAM' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`NodeJS API running correctly - Servidor corriendo en http://localhost:${PORT}`);
});
//=======[ End of file ]=======================================================