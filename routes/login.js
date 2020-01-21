// Importaciónes
var express = require('express');
var bcrypt = require('bcryptjs'); // importación para encriptación de contraseña
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Levantamos el express
var app = express();
var Usuario = require('../models/usuario'); // Nos permite utilizar todos las funciones y los metodos que tiene el modelo


// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// ==============================================================
//  Autenticación de Google
// ==============================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });


    const payload = ticket.getPayload();
     const userid = payload['sub']; 
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        // payload
    }
}
// Debe ser una función async para que funcione
app.post('/google', async (req, res) => {

    var token = req.body.token;
    // Esta función regresa un usuario de google o si no es valido el token dispara un catch
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido!!'

            });
        });

    // Verificar si el usuario existe

    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB) => {
        // En caso de error

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar usuario - login',
                errors: err
            });
        }
        // Si existe un usuario creado por google
        if (usuarioDB) {
            // si este usuario no es autentificado por google
            if (usuarioDB === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticación normal!!'

                });

            }
            else {
                usuarioDB.password = ':)'; // quitando contraseña
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                // En caso de exito
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtnerMenu(usuarioDB.role) // ROLE
                });
            }
        } else {
            // El usuario no existe hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            // Grabamos el usuario
            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al crear usuario - google',
                        errors: err
                    });
                }


                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtnerMenu(usuarioDB.role) // ROLE
                });

            });

        }


    });


});


// ==============================================================
//  Autenticación Normal
// ==============================================================

// Metodo de Login

app.post('/', (req, res) => {


    // Recibir correo y contraseña
    var body = req.body;


    // Verificación de usuario si tiene este correo electronico 
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // En caso de error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }


        // Evaluar si existe el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Evaluamos la contraseña | bcrypt.compareSync: regresa un valor booleano
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Crear un Token : parametros payload, semilla (definir de forma unica)  y la fecha de expiración
        usuarioDB.password = ':)'; // quitando contraseña
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        // En caso de exito
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtnerMenu(usuarioDB.role) // ROLE
        });


    });

});

function obtnerMenu (ROLE){

    var menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{ titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Médicos', url: '/medicos' },
            ]
        }
    ];


    if (ROLE === 'ADMIN_ROLE') {
        //unshif lo coloca al principio
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios'});
        
    }
    return menu;
}


// Exportar esta ruta fuera de este archivo
module.exports = app;