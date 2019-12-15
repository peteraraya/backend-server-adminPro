// Importaciónes
var express = require('express');
var bcrypt = require('bcryptjs'); // importación para encriptación de contraseña
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Levantamos el express
var app = express();
var Usuario = require('../models/usuario'); // Nos permite utilizar todos las funciones y los metodos que tiene el modelo


// Metodo de Login

app.post('/', (req, res)=>{


    // Recibir correo y contraseña
    var body = req.body;


    // Verificación de usuario si tiene este correo electronico 
    Usuario.findOne({email: body.email},  (err, usuarioBD)=>{

        // En caso de error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios!',
                errors: err
            });
        }

        // Evaluar si existe el usuario
        if( !usuarioBD ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        // Evaluamos la contraseña | bcrypt.compareSync: regresa un valor booleano
        if( !bcrypt.compareSync( body.password, usuarioBD.password) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
            
        }

        // Crear un Token : parametros payload, semilla (definir de forma unica)  y la fecha de expiración
        usuarioBD.password =':)'; // quitando contraseña
        var token = jwt.sign({Usuario: usuarioBD}, SEED ,{expiresIn:14000}) // expira en 4 horas

        // En caso de exito
        res.status(200).json({
            ok: true,
            Usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
         });

    });

});










// Exportar esta ruta fuera de este archivo
module.exports = app;