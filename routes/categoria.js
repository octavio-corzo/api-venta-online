const { Router } = require('express');
const { check } = require('express-validator');
const { getCategoria, postCategoria, putCategoria, deleteCategoria, deleteCategoriaPrueba } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getCategoria)

router.post('/agregar',[
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCategoria)

router.put('/editar/:id', putCategoria)

router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo VÃ¡lido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
    esAdminRole
] ,deleteCategoria);



module.exports = router;