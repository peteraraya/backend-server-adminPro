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


