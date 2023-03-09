const express = require('express')
const cors = require ('cors');
const {dbConection} = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //this.categoriasPath = '/api/categoria'

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            carritos: '/api/carritos',
            facturas: '/api/facturas',
            productos: '/api/productos',
            usuarios: '/api/usuarios'
        }

        this.conectarDB();
        this.middlewares();
        this.routes();

    }
    
    middlewares(){
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public') )
    }

    async conectarDB(){
        await dbConection();
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categoria'));
        this.app.use(this.paths.carritos, require('../routes/carrito-de-compras'));
        this.app.use(this.paths.facturas, require('../routes/factura'));
        this.app.use(this.paths.productos, require('../routes/producto'));
        this.app.use(this.paths.usuarios, require('../routes/usuario'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor Corriendo en puerto', this.port);
        })
    }
}


module.exports = Server;