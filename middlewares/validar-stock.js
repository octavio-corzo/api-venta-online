const { request, response } = require("express");
const Producto = require("../models/producto");

const validarStock = async (req = request, res = response, next) => {
  const { productos } = req.body;

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const productoDisponible = await Producto.findById(producto);

    if (productoDisponible) {
      if (productoDisponible.disponible === false) {
        return res.status(400).json({
          msg: `El producto no esta disponible en este momento.`,
        });
      }
    }
  }

  next();
};

module.exports = {
  validarStock,
};
