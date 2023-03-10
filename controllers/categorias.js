const { response, request } = require("express");

const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const getCategoria = async (req = request, res = response) => {
  const query = { estado: true };

  const listaCategorias = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).populate("usuario", "nombre"),
  ]);

  res.json({
    msg: "get Api - Controlador Categoria",
    listaCategorias,
  });
};

const getCategoriaPorID = async (req = request, res = response) => {
  const { id } = req.params;
  const categoriaById = await Categoria.findById(id).populate(
    "usuario",
    "nombre"
  );

  res.status(201).json(categoriaById);
};

const postCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  //Verificar si ya existe la categoria con ese nombre y si es verdad no agregue la categoria
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe.`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  await categoria.save();

  res.status(201).json(categoria);
};

const putCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const { estado, usuario, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();
  resto.usuario = req.usuario._id;

  //Editar o actualizar la categoria
  const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });

  res.status(201).json(categoria);
};

const deleteCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const query = { categoria: id };
  const productos = await Producto.find(query);
  const productoId = productos.map((product) => product._id);
  const idAdmin = req.usuario.id;

  const colleccion = "Categoria default";
  const categoriaDB = await Categoria.findOne({ nombre: colleccion });

  if (!categoriaDB) {
    const deleteCategoria = new Categoria({
      nombre: "Categoria default",
      usuario: idAdmin,
    });

    await deleteCategoria.save();
  }

  const querys = { nombre: "Categoria default" };
  const { _id } = await Categoria.findOne(querys);

  const editado = await Producto.updateMany({ categoria: id }, { categoria: _id });

  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.status(201).json(categoriaBorrada);
};

module.exports = {
  getCategoria,
  postCategoria,
  putCategoria,
  deleteCategoria,
};
