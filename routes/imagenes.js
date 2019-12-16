// Un servicio que nos permita retornar la imagen de un usuario, hospital o medico
// si la persona no tiene una imagen que nos retorne una imagen por defecto

// Importaciónes
var express = require('express');

var app = express();

const path = require('path');// ayuda a crear path
const fs = require('fs');


// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // verificación de un path | __dirname obtengo toda la ruta
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    // Verificar si el path existe en ese path || fs : nos permite validar el path


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }


});


// Exportar esta ruta fuera de este archivo
module.exports = app;