//Importación
var mongoose = require('mongoose');

// Importación validaciones
var uniqueValidator = require('mongoose-unique-validator');

// Función para definir esquemas
var Shema = mongoose.Schema;

// validar roles
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


// Defirme el usuario esquema
var usuarioSchema = new Shema({

    // Van todos los campos menos el id
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, required: true, default: false }

});

// Utilizar validaciones
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

// Utilizar esquema afuera de este archivo
module.exports = mongoose.model('Usuario', usuarioSchema);