const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).populate("compras", )
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const getComprasUsuario = async (req = request, res = response) => {
    const idUsuario = req.usuario.id;
    //const { id } = req.params;
    const userById = await Usuario.findById(idUsuario).populate('compras');
    res.status(201).json(userById);

}

const postUsuario = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, correo, password, rol } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}


const putUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, img,  /* rol,*/  estado, google, ...resto } = req.body;

    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'PUT editar usuario',
        usuarioEditado
    });

}

const putAdmin = async (req = request, res = response) => {
    const idAdmin = req.usuario.id;
    const { _id, img, estado, google, ...resto } = req.body;

    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(idAdmin, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteUsuario = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    //Eliminar fisicamente de la DB
    //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    getComprasUsuario,
    postUsuario,
    putUsuario,
    putAdmin,
    deleteUsuario
}


// CONTROLADOR