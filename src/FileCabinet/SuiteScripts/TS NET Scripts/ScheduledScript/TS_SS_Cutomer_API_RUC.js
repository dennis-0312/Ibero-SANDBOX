/*********************************************************************************************************************************************
This script for Sales Order (Servicio Rest para emisión de ordenes de venta) 
/*********************************************************************************************************************************************
File Name: TS_SS_Cutomer_API_RUC.js                                                                        
Commit: 01                                                        
Version: 1.0                                                                     
Date: 31/03/2022
ApiVersion: Script 2.1
Enviroment: SB
Governance points: N/A
=============================================================================================================================================*/
/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(['N/https', 'N/log', 'N/encode', 'N/file', 'N/search', 'N/record', 'N/email', 'N/http'], (https, log, encode, file, search, record, email, http) => {

    const execute = (context) => {
        let headerObj = new Array();
        try {
            let dni = '07684016';
            let ruc = '20607288209';
            const token = '094b9378a57a63fee2fc08792d8a77b6bbc57699';
            let token2 = 'fiBMncPw7CmIbCmCrJTi4QRIgn1Nq2CT2CWX8ux8';

            let ur1DNI1 = 'https://api.apis.net.pe/v1/dni?numero=' + dni;
            let urlDNI2 = 'https://consulta.apiperu.pe/api/dni/' + dni;
            let urlDNI3 = 'https://www.howsmyssl.com/a/check';
            let urlDNI4 = 'https://cloud.novoapi.com/api/reniec/' + token2 + '/' + dni;
            let urlDNIMain = 'https://consulta.api-peru.com/api/dni/' + dni;
            let urlRUCMain = 'https://consulta.api-peru.com/api/ruc/' + ruc;
            //let token = random() + random() + random() + random() + random();

            headerObj['Accept'] = '*/*';
            headerObj['Content-Type'] = 'application/json';
            headerObj['Authorization'] = token;

            try {
                let response = https.get({
                    url: urlDNIMain,
                    headers: headerObj
                });

                // log.debug('Response', response);
                var code = JSON.parse(response.code);
                log.debug('body', code);
                var body = JSON.parse(response.body);
                log.debug('body', body);
                var success = body.success;
                log.debug('body', success);
            } catch (error) {
                log.debug('Error-execute-interno', error);
            }

        } catch (error) {
            log.debug('Error-execute', error);
        }
    }

    const random = () => {
        return Math.random().toString(36).substr(2); // Eliminar `0.`
    };


    const tokens = () => {
        return random() + random() + random() + random() + random(); // Para hacer el token más largo
    };

    return {
        execute: execute
    }
});
