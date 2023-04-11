/*******************************************************************************************************************
This script for Cash Sale (Evento para generar serie, correlativo y seteo de campos obligatorios) 
/******************************************************************************************************************* 
File Name: TS_UE_Cash_Sale.js                                                                        
Commit: 01                                                        
Version: 1.0                                                                     
Date: 20/04/2022
ApiVersion: Script 2.1
Enviroment: PR
Governance points: N/A
==================================================================================================================*/
/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/search', 'N/record', 'N/runtime'], (log, search, record, runtime) => {
    //const OPERATION_TYPE = 47; //Venta Nacional
    // const EI_OPERATION_TYPE = 101; //Venta Interna
    // const EI_FOMRA_PAGO = 1; // Contado
    const DOCUMENT_TYPE_RUC = 4; //Registro Unico De Contribuyentes
    const DOCUMENT_TYPE_DNI = 2; //Documento Nacional De Identidad
    const DOCUMENT_TYPE_FACTURA = 103; //Factura
    const DOCUMENT_TYPE_BOLETA = 101; // Boleta
    // const DOCUMENT_TYPE_NC = 106;
    // const DOCUMENT_TYPE_ND = 107;
    let doctype = 0;
    let prefix = '';
    // const PAYMENT_METHOD = 1; //Efectivo
    const beforeLoad = (context) => {
        const objRecord = context.newRecord;
        try {
            const userObj = runtime.getCurrentUser();
            let userClassification = search.lookupFields({ type: search.Type.EMPLOYEE, id: userObj.id, columns: ['department', 'class', 'location'] });
            objRecord.setValue({ fieldId: 'department', value: userClassification.department[0].value, ignoreFieldChange: true });
            objRecord.setValue({ fieldId: 'class', value: userClassification.class[0].value, ignoreFieldChange: true });
            objRecord.setValue({ fieldId: 'location', value: userClassification.location[0].value, ignoreFieldChange: true });
            //! Falta campo
            //newRecord.setValue({ fieldId: 'paymentmethod', value: PAYMENT_METHOD, ignoreFieldChange: true });
        } catch (e) {
            log.error({ title: 'Error-beforeLoad', details: e });
        }
    }


    // const beforeSubmit = (context) => {
    //     const objRecord = context.newRecord;
    //     const customer = objRecord.getValue({ fieldId: 'entity' });
    //     const location = objRecord.getValue({ fieldId: 'location' });
    //     try {
    //         let searchField = search.lookupFields({ type: search.Type.CUSTOMER, id: customer, columns: ['custentity_pe_document_type'] });

    //         if (searchField.custentity_pe_document_type[0].value == DOCUMENT_TYPE_RUC) {
    //             doctype = DOCUMENT_TYPE_FACTURA;
    //             prefix = 'FA-';
    //         } else {
    //             doctype = DOCUMENT_TYPE_BOLETA;
    //             prefix = 'BV-';
    //         }
    //         objRecord.setValue({ fieldId: 'custbody_pe_document_type', value: doctype, ignoreFieldChange: true });
    //         let getserie = getSerie(doctype, location, prefix);
    //         let correlative = generateCorrelative(getserie.peinicio, getserie.serieid, getserie.serieimpr);
    //         objRecord.setValue({ fieldId: 'custbody_pe_number', value: correlative.correlative, ignoreFieldChange: true });
    //         objRecord.setValue({ fieldId: 'custbody_pe_serie', value: getserie.serieid, ignoreFieldChange: true });
    //         objRecord.setValue({ fieldId: 'tranid', value: correlative.numbering });
    //     }
    //     catch (e) {
    //         log.error({ title: 'Error-beforeSubmit', details: e });
    //     }
    // }


    const getSerie = (documenttype, location, prefix) => {
        try {
            const searchLoad = search.create({
                type: 'customrecord_pe_serie',
                filters: [
                    ['custrecord_pe_tipo_documento_serie', 'anyof', documenttype],
                    'AND',
                    ['custrecord_pe_location', 'anyof', location]
                ],
                columns: [
                    {
                        name: 'internalid',
                        sort: search.Sort.ASC
                    },
                    'custrecord_pe_inicio',
                    'custrecord_pe_serie_impresion'
                ]
            });

            const searchResult = searchLoad.run().getRange({ start: 0, end: 1 });
            const column01 = searchResult[0].getValue(searchLoad.columns[0]);
            let column02 = searchResult[0].getValue(searchLoad.columns[1]);
            let column03 = searchResult[0].getValue(searchLoad.columns[2]);
            column03 = prefix + column03;
            column02 = parseInt(column02);
            return {
                'serieid': column01,
                'peinicio': column02,
                'serieimpr': column03
            };
        } catch (e) {
            log.error({ title: 'getPeSerie', details: e });
        }
    }


    const generateCorrelative = (return_pe_inicio, serieid, serieimpr) => {
        let ceros;
        let correlative;
        let numbering;
        let this_number = return_pe_inicio;

        const next_number = return_pe_inicio + 1
        record.submitFields({ type: 'customrecord_pe_serie', id: serieid, values: { 'custrecord_pe_inicio': next_number } });

        if (this_number.toString().length == 1) {
            ceros = '0000000';
        } else if (this_number.toString().length == 2) {
            ceros = '000000';
        } else if (this_number.toString().length == 3) {
            ceros = '00000';
        } else if (this_number.toString().length == 4) {
            ceros = '0000';
        } else if (this_number.toString().length == 5) {
            ceros = '000';
        } else if (this_number.toString().length == 6) {
            ceros = '00';
        } else if (this_number.toString().length == 7) {
            ceros = '0';
        } else if (this_number.toString().length >= 8) {
            ceros = '';
        }

        correlative = ceros + this_number;
        numbering = serieimpr + '-' + correlative;

        return {
            'correlative': correlative,
            'numbering': numbering
        }
    }

    return {
        beforeLoad: beforeLoad,
        //beforeSubmit: beforeSubmit
    }
});
/***************************************************************************************************************
TRACKING
/***************************************************************************************************************
/* Commit:01
Version: 1.0
Date: 28/01/2022
Author: Dennis Fernández
Description: Creación del script.
==============================================================================================================*/