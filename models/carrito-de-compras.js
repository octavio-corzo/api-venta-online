const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    carrito: {
        type: String,
        required: [true , 'El nombre del carrito es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        default: null
    }],
});


module.exports = model('Carrito', CarritoSchema);