const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito} = require('../controllers/carrito-de-compras');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTProducto } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getCarrito)

router.post('/agregarCarrito',[
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCarrito)


/*router.put('/editar/:id', putCategoria)

router.delete('/eliminar/:id', deleteCategoria)*/



module.exports = router;