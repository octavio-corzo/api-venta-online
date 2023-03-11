const { Router } = require("express");
const { check } = require("express-validator");
const {
  getCarrito,
  postCarrito,
  putCarrito,
  deleteCarrito,
} = require("../controllers/carrito-de-compras");

const { validarCampos } = require("../middlewares/validar-campos");
const {
  validarJWT,
  validarJWTProducto,
} = require("../middlewares/validar-jwt");
const { validarStock } = require("../middlewares/validar-stock");
const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const { existeCarritoPorId } = require("../helpers/db-validators");

const router = Router();

router.get("/mostrar", getCarrito);

router.post(
  "/agregarCarrito",
  [
    validarJWT,
    tieneRole("CLIENT_ROLE"),
    check("carrito", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
    validarStock,
  ],
  postCarrito
);

router.put(
  "/editar/:id",
  [
    validarJWT,
    tieneRole("CLIENT_ROLE"),
    check("carrito", "El nombre es obligatorio").not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCarritoPorId ),
    validarCampos,
  ],
  putCarrito
);

router.delete("/eliminarCarrito/:id", [
    validarJWT,
    tieneRole("CLIENT_ROLE"),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCarritoPorId ),
    validarCampos,
], deleteCarrito);

module.exports = router;
