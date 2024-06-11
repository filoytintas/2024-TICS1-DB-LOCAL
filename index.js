const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const { Schema } = mongoose; // Importa Schema desde mongoose

const app = express();
const PORT = 3000; // Puerto en el que escuchará el servidor

// Conexión a MongoDB
mongoose.connect('mongodb://root:example@localhost:27017/magnitudes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Esquema para la colección 1
const Coleccion1Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true }
});

// Esquema para la colección 2
const Coleccion2Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true }
});

// Esquema para la colección 3
const Coleccion3Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true }
});

/*
module.exports = {
  Coleccion1: mongoose.model('Coleccion1', Coleccion1Schema),
  Coleccion2: mongoose.model('Coleccion2', Coleccion2Schema),
  Coleccion3: mongoose.model('Coleccion3', Coleccion3Schema)
};
*/

// Modelos de las colecciones
const Coleccion1 = mongoose.model('sensor_1', Coleccion1Schema);
const Coleccion2 = mongoose.model('sensor_2', Coleccion2Schema);
const Coleccion3 = mongoose.model('sensor_3', Coleccion3Schema);


// Ruta para registrar datos en una colección específica (usando el método GET)
app.get('/api/:coleccion/registrar', async (req, res) => {
  const { coleccion } = req.params;
  const { value } = req.query;

  try {
    // Crea un nuevo documento en la colección correspondiente
    let nuevoDocumento;
    switch (coleccion) {
      case 'sensor_1':
        nuevoDocumento = await Coleccion1.create({ value: value });
        break;
      case 'sensor_2':
        nuevoDocumento = await Coleccion2.create({ value: value });
        break;
      case 'sensor_3':
        nuevoDocumento = await Coleccion3.create({ value: value });
        break;
      default:
        return res.status(400).json({ error: 'Colección no válida' });
    }
    res.status(201).json({ message: 'Datos registrados correctamente', documento: nuevoDocumento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar los datos' });
  }
});


// Ruta para obtener todos los registros de una colección específica
app.get('/api/:coleccion', async (req, res) => {
  const { coleccion } = req.params;

  try {
    let registros;
    switch (coleccion) {
      case 'sensor_1':
        registros = await Coleccion1.find();
        break;
      case 'sensor_2':
        registros = await Coleccion2.find();
        break;
      case 'sensor_3':
        registros = await Coleccion3.find();
        break;
      default:
        return res.status(400).json({ error: 'Colección no válida' });
    }
    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Ruta para obtener el último registro de una colección específica
app.get('/api/:coleccion/ultimo', async (req, res) => {
  const { coleccion } = req.params;

  try {
    let ultimoRegistro;
    switch (coleccion) {
      case 'sensor_1':
        ultimoRegistro = await Coleccion1.findOne().sort({ _id: -1 });
        break;
      case 'sensor_2':
        ultimoRegistro = await Coleccion2.findOne().sort({ _id: -1 });
        break;
      case 'sensor_3':
        ultimoRegistro = await Coleccion3.findOne().sort({ _id: -1 });
        break;
      default:
        return res.status(400).json({ error: 'Colección no válida' });
    }
    res.json(ultimoRegistro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el último registro' });
  }
});

// Ruta de bienvenida y descripción de la API
app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenid@ a la API</h1>
    <p>Esta API permite gestionar los registros medidos por la dupla [Arduino+ESP32] en MongoDB.</p>
    <h2>Rutas disponibles:</h2>
    <ul>
      <li><strong>GET /api/sensor_&lt;numero_del_sensor&gt;/registrar</strong>: añade un nuevo registro a la base de datos (<b>parámetro:</b> value)<i> Ejemplo: /api/sensor_1/registrar?value=123</i></li>
      <li><strong>GET /api/sensor_&lt;numero_del_sensor&gt;/ultimo</strong>: Obtiene el último registro ingresado de un sensor específico<i> Ejemplo: /api/sensor_1/ultimo</i></li>
      <li><strong>GET /api/sensor_&lt;numero_del_sensor&gt;</strong>: Obtiene todos los registros de un sensor específico<i> Ejemplo: /api/sensor_1</i></li>
    </ul>
    <p>Desarrollado por R.C. para TICs I en junio de 2024</p>
  `);
});

// Función para obtener la dirección IP local
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      const alias = interfaces[iface][i];
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
};

app.listen(PORT, () => {
  const ipAddress = getLocalIPAddress();
  console.log(`API corriendo en http://${ipAddress}:${PORT}`);
});