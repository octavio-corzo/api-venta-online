const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la factura es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    carrito: {
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    }
});


module.exports = model('factura', FacturaSchema);