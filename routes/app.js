// Importaciónes
var express = require ('express');
var app = express();

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        // estandarizar salidas
        ok: true,
        mensaje: 'Petición realizada correctamente'
    }) // hizo todo correcto, se encia en formato de json

});


// Exportar esta ruta fuera de este archivo
module.exports = app;