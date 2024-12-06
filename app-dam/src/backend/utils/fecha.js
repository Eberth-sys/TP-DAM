//PIPELINE PARA EL FORMATO DE FECHA.

// OBTENGO LA FECHA Formato ISO básico
const obtenerFechaISO = (fecha) => fecha.toISOString();

// Función CORTA
const recortarFecha = (fechaISO) => fechaISO.slice(0, 19);

// reemplazar la T por un espacio
const ajustarFormatoFecha = (fechaRecortada) => fechaRecortada.replace('T', ' ');

// Pipeline FINAL
const procesarFecha = (fecha) => ajustarFormatoFecha(recortarFecha(obtenerFechaISO(fecha)));

// Olvide exportarlo jajaja
module.exports = { procesarFecha };