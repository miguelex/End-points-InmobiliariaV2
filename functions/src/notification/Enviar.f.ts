import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';

if(!admin.apps.length){
    admin.initializeApp();
}

const messaging = admin.messaging();

const endPointExpress = express();
const corsVal = cors({origin: true});
endPointExpress.options('*', corsVal);
endPointExpress.use(corsVal);
endPointExpress.use(cookieParser());

endPointExpress.post('*', async (req, res) => {
    try {
        const _notificationToken = req.body.token;

        const options = {
            priority :'high',
            timeToLive: 60*60*24
        }

        const payload = {
            notification : {
                title : "Saludos de Miguelex",
                body : "Enviada una notificacion push desde mi pagina de inmobiliaria"
            },
            data : {
                adicionalMigue : "Esto es un contenido extra",
                adicionalLex : "Este es otro contenido extra"
            }

        }
        
        if (_notificationToken && _notificationToken.length > 0){
            const respuesta = await messaging.sendToDevice(_notificationToken, payload, options);
            res.status(200);
            res.send({status:"success", mensaje: "La notificacion se envio correctamente", detalle: respuesta})
        } else {
            res.status(200);
            res.send({status:"success", mensaje :" Este usuario no tiene token"})
        }

    }
    catch (e) {
        res.status(401);
        res.send(e);
    }
})

export = module.exports = functions.https.onRequest((request, response)=>{
    return endPointExpress(request, response);
})
