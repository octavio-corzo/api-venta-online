const { Router } = require('express');
const { check } = require('express-validator');
const { getCategoria, postCategoria, putCategoria, deleteCategoria } = require('../controllers/categorias');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getCategoria)

router.post('/agregar',[
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos
], postCategoria)

router.put('/editar/:id', putCategoria)

router.delete('/eliminar/:id', deleteCategoria)



module.exports = router;