// Importaciónes
var express = require('express');
var bcrypt = require('bcryptjs');// importación para encriptación de contraseña
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middlewares/autenticacion');

// Levantamos el express
var app = express();

var Usuario = require('../models/usuario'); // Nos permite utilizar todos las funciones y los metodos que tiene el modelo


// ======================================================
// Obtener todos los usuarios
// ======================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; // si no viene nada voy a poner un 0
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google') // realizo un filtro de los campos que deseo mostrar
        .skip(desde) // salte y muestre los siguiente
        .limit(5) // asigo el limite de registros
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios!',
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => { // cuente todo los registros , recibo error y conteo

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                })

            });
});

// ======================================================
// Actualizar usuario
// ======================================================
// es necesario mandar un id para este recurso
// si quiero mandar 2 o más middleware los coloco entre llaves
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario] , (req, res) => {
    //obtener id
    var id = req.params.id;
    var body = req.body;
    //Verificar si un usuario existe con ese id
    Usuario.findById(id, (err, usuario) => {
        // En caso de error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }
        // Evaluar si viene un usuario
        if (!usuario) {
            // En caso que no venga un usuario
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el ID:' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }
        }
        // Si encuentra usuario y se actualiza la data 
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        // Grabación
        usuario.save((err, usuarioGuardado) => {
            // En caso de error
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            // Registro actualizado con exito
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

});


// ======================================================
// Crear un nuevo usuario
// ======================================================

app.post('/', (req, res) => {

    var body = req.body;
    // utilizaremos una variable haciendo referencia al model o correspondiente
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    // Guardar usuario, utiliza un call back con dos parametros
    usuario.save((err, usuarioGuardado) => {

        // En caso de error
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios!',
                errors: err
            });
        }
        // En caso de exito
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });


    });

});

// ======================================================
// Boorar un usuario por id
// ======================================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE] ,(req, res, next) => {
    //obtener id
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        // En caso de error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario!',
                errors: err
            });
        }
        // Validación
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID!',
                errors: { message: 'No existe un usuario con ese ID!' }
            });
        }
        // En caso de exito
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});



// Exportar esta ruta fuera de este archivo
module.exports = app;