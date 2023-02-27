const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verficiar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
            });
        }

        //Si el usuario esta activo (estado = false)
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        
        //Verificar la password
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Login PATH',
            correo, password,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }

}

const jwtProducto = async (req = request, res = response) => {

    const { nombre } = req.body;

    try {

        //Verficiar si el email existe
        const producto = await Producto.findOne({ nombre });
        if ( !producto ) {
            return res.status(400).json({
                msg: 'El nombre del producto no existe'
            });
        }

        //Si el usuario esta activo (estado = false)
        if ( !producto.estado ) {
            return res.status(400).json({
                msg: 'El producto tiene estado: false'
            });
        }
        
        //Generar JWT
        const token = await generarJWT( producto.id );

        res.json({
            msg: 'producto token PATH',
            nombre,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }



}


module.exports = {
    login,
    jwtProducto
}