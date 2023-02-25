const jwt = require('jsonwebtoken');

// jwt trabaja en base a callbacks y en base a promesas
const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid }

        jwt.sign( payload, process.env.SECRET_KEY_FOR_TOKEN, {
            expiresIn: '5h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }

        } )

    } );

}


module.exports = {
    generarJWT
}
