// Requires : importaciones de librerías de terceros o personalizadas que utilizamos para que funcione algo | Todo es caseSensitive
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express(); // incializando mi servidor de express

// Body Parser, body parse toma lo que se envie por boy y lo convierte en objeto js para poderlo utilizar en cualquier lugar
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Conexión a la Base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    // parametros error y response
    if( err ) throw err; 
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config | fomra publica de mostrar imagenes
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas : utilizaremos un midleware (se ejecuta antes que se resuelvan otras rutas)
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

// Siempre al final
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () =>{
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
}) 

