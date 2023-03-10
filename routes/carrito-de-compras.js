const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito, putCarrito} = require('../controllers/carrito-de-compras');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTProducto } = require('../middlewares/validar-jwt');
const { validarStock } = require('../middlewares/validar-stock');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getCarrito)

router.post('/agregarCarrito',[
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    validarStock
], postCarrito)

router.put ('/editar/:id',[
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], putCarrito)

// idEmpresa = req.empresa.id

/*router.put('/editar/:id', putCategoria)

router.delete('/eliminar/:id', deleteCategoria)*/



module.exports = router;