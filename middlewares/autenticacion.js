var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ======================================================
// Verificar token : 
//      se coloca en esta posición porque mas abajo vienen 
//      todas peticiones que quiero verificar
// ======================================================
exports.verificaToken = function (req, res, next) {

    // Recibir token
    var token = req.query.token;

    // verificar validez del token
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
        // Puede continuar
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // }); 
    });
}


// Creamos otro middleware que verificará si es un administrador
// si es administrador lo dejo pasar si no enviamos un error
// ======================================================
// verificaADMIN_ROLE
// ======================================================
exports.verificaADMIN_ROLE = function (req, res, next) {

    var usuario = req.usuario;

    // Validación
    if (usuario.role === 'ADMIN_ROLE') {
        // Si es valido  continuo ejecutando los demaás procesos
        next();
        return;
    }else{
        // Si no es un usuario administrativo
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto - NO eres administrador',
                errors: { mesasage: 'No eres admnistrador, que te crees no puedes hacer eso (¬_¬)  !!' }
            });
    }

}
// ======================================================
// verificaADMIN_ROLE o mismo usuario
// ======================================================
exports.verificaADMIN_o_MismoUsuario = function (req, res, next) {

    var usuario = req.usuario;
    // obtengo id por parametro del url
    var id = req.params.id;

    // Validación si es admin role o si el id del url es igual al del token
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        // Si es valido  continuo ejecutando los demaás procesos
        next();
        return;
    } else {
        // Si no es un usuario administrativo
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - NO eres administrador ni es el mismo usuario',
            errors: { mesasage: 'No eres admnistrador, que te crees no puedes hacer eso (¬_¬)  !!' }
        });
    }


}



