const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res= response, next ) => {

    const token = req.header('x-token');

    //Si no viene el token
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    
    try {

        const { uid } = jwt.verify( token, process.env.SECRET_KEY_FOR_TOKEN);
       
        // leer al usuario que corresponda el uid
        const usuario = await Usuario.findById( uid );
        
        //Verificar si el uid del usuario no existe
        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB fisicamente'
            })
        }

        //Verufucar su ek uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }


        req.usuario = usuario;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


}

module.exports = {
    validarJWT
}
