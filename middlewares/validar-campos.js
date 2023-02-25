const { response, request } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req = request, res = response, next ) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    //Next sirve para seguir ejecutando el middleware
    next();

}


module.exports = {
    validarCampos
}