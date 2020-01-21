// Importaciónes
var express = require('express');
var app = express();


// Para poder importar hospitales hay que importar el modelo
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i'); // expresión regular

    var promesa; // será la promesa que quiero ejecutar
    // switch para las desiciones
    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({ // error bad request
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    // Ejecuón de promesa
    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data // imprimo lo que yo filtre, utilizando propiedades de objeto computada, es el resultado de lo que tenga esa variable 
        });

    })

});




// ==============================
// Busqueda general
// ==============================
// Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    // Extraer parametro de busqueda
    var busqueda = req.params.busqueda; // es lo que la persona está escibiendo en el segmento del url

    // Creación de exresión regular para 
    // poder cambiar la insibilidad de formato de texto
    var regex = new RegExp(busqueda, 'i'); // enviamosla url y  la expresión i porque queremos que el texto sea insensible a las mayusculas y minusculas

    // Permite  llamar un arreglo de promesas, ejecutarlas y si todas responden correctamente podemos disparar un then y si una falla tendriamos que manejar el cath
    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])
        .then(respuestas => {
            res.status(200).json({
                // estandarizar salidas
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            }) // hizo todo correcto, se encia en formato de json

        }); //recibe un arreglo con las respuestas en la misma posición en la que se encuentran 
});


// ========================================================================================
// Promesas : Transformaremos la busqueda en una promesa para realizar multiples consultas
// ========================================================================================


function buscarHospitales(busqueda, regex) {

    // Creanos una promesa y la retornamos
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img') // que usuario creo que hospital
            .exec((err, hospitales) => {

                if (err) {
                    reject(' Error al cargar Hospitales ', err);
                }
                else {
                    resolve(hospitales); //envío data de hospitales
                }
            });
    });
}


function buscarMedicos(busqueda, regex) {

    // Creanos una promesa y la retornamos
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject(' Error al cargar Medicos ', err);
                }
                else {
                    resolve(medicos); //envío data de hospitales
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img') // envio un string con los campos que quiero y evito enviar el passwopr
            .or([{ 'nombre': regex }, { 'email': regex }]) // recibo un arreglo de condiciones 
            .exec((err, usuarios) => { // error y recibo el usuario

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });
}
// Exportar esta ruta fuera de este archivo
module.exports = app;