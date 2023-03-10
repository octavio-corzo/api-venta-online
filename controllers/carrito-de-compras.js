const { response, request } = require("express");

const Carrito = require("../models/carrito-de-compras");
const Producto = require("../models/producto");

const getCarrito = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listaCarritos = await Promise.all([
    Carrito.countDocuments(query),
    Carrito.find(query).populate("usuario", "nombre").populate("productos"),
    //.populate('productos', 'precio'),
  ]);

  res.json({
    msg: "get Api - Controlador Carrito",
    listaCarritos,
  });
};

const postCarrito = async (req = request, res = response) => {
  const carrito = req.body.carrito.toUpperCase();
  const { productos, cantidadProductos } = req.body;
  const carritoDB = await Carrito.findOne({ carrito });
  let totales = 0;
  let totalFinal = 0;

  //Si el carrito existe no lo agrega.
  if (carritoDB) {
    return res.status(400).json({
      msg: `El carrito ${carritoDB.carrito}, ya existe.`,
    });
  }

  for (let i = 0; i < productos.length; i++) {
    const cantidadxProducto = cantidadProductos[i];
    const listaProductos = productos[i];
    const query = await Producto.findById(listaProductos);
    let precio = query.precio;
    let cantidad = parseInt(cantidadxProducto);

    totales = precio * cantidad;

    totalFinal = totales + totalFinal;
  }

  const data = {
    carrito,
    usuario: req.usuario._id,
    total: totalFinal,
  };

  const carritos = new Carrito(data);
  carritos.productos.push(...req.body.productos);

  await carritos.save();
  res.status(201).json(carritos);
};

const putCarrito = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...resto } = req.body;

  resto.carrito = resto.carrito.toUpperCase();
  resto.productos = [...req.body.productos];
  resto.usuario = req.usuario._id;

  const carritoEditado = await Carrito.findByIdAndUpdate(id, resto, {
    new: true,
  });

  res.status(201).json(carritoEditado);
};

module.exports = {
  getCarrito,
  postCarrito,
  putCarrito,
};
