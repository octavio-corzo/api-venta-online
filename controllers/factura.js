const { request, response } = require('express');
const Factura = require('../models/factura');
const Carrito = require('../models/carrito-de-compras');
const Producto = require("../models/producto");
const getFacturas = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaFactura = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query)
            
            .populate('admin', 'correo')
            .populate('cliente', 'nombre')
            .populate('carrito', "carrito").populate('productos'),

        //Carrito.find(query).populate('productos')
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaFactura
    });

}

const getFacturaPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const facturaById = await Factura.findById(id)
        //.populate('usuario', 'nombre')
        .populate('admin', 'correo')
        .populate('cliente', 'nombre')
        .populate('carrito', )

    res.status(201).json(facturaById);

}

const postFactura = async (req = request, res = response) => {

    const { estado, admin, ...body } = req.body;
    const { productos, cantidadProductos } = req.body;
    let totales = 0;
    let totalFinal = 0;

    const facturaDB = await Factura.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if ( facturaDB ) {
        return res.status(400).json({
            msg: `La factura ${ facturaDB.nombre }, ya existe en la DB`
        });
    }

    for (let x = 0; x < productos.length; x++) {
        const cantidadxProducto = cantidadProductos[x];
        const listaProductos = productos[x];
        const query = await Producto.findById(listaProductos);
        let precio = query.precio;
        let cantidad = parseInt(cantidadxProducto);
    
        totales = precio * cantidad;
    
        totalFinal = totales + totalFinal;
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        admin: req.usuario._id,
        total: totalFinal,
    }

    const factura = await Factura( data );

    //Guardar en DB
    await factura.save();

    res.status(201).json( factura );
   
}

const putProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, ({ new: true }));

    res.status(201).json({
        msg: 'Put Controller Producto',
        productoActualizado
    });
}

const deleteProducto = async (req = request, res = response) => {
    
    const {id} = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json({
        msg: "DELETE",
        productoEliminado
    });
}




module.exports = {
    getFacturas,
    getFacturaPorID,
    postFactura,
    putProducto,
    deleteProducto
}