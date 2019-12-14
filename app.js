// Requires : importaciones de librerías de terceros o personalizadas que utilizamos para que funcione algo | Todo es caseSensitive
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app  = express(); // incializando mi servidor de express


// Conexión a la Base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    // parametros error y response
    if( err ) throw err; 
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next)  => {
   
    res.status(200).json({
        // estandarizar salidas
        ok: true,
        mensaje: 'Petición realizada correctamente'
    }) // hizo todo correcto, se encia en formato de json

});

// Escuchar peticiones
app.listen(3000, () =>{
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
}) 

