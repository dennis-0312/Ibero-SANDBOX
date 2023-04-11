/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = =\
||                                                                                                                  ||
||   This script for Cash Sales (Setea document type, serie and numberd)                                            ||
||                                                                                                                  ||                                      
||   File Name: evol_bg_cs_cash_sales.js                                                                           ||
||                                                                                                                  ||
||   Commit      Version     Date            ApiVersion         Enviroment       Governance points                  ||
||   01          1.1         228/01/2022     Script 2.1         SB               N/A                               ||
||                                                                                                                  ||
\  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = = */
/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/log', 'N/currentRecord', 'N/search'], (log, currentRecord, search) => {
    const DOCUMENT_TYPE_RUC = 4; //Registro Unico De Contribuyentes
    const DOCUMENT_TYPE_DNI = 2; //Documento Nacional De Identidad
    const DOCUMENT_TYPE_FACTURA = 103; //Factura
    const DOCUMENT_TYPE_BOLETA = 101; // Boleta

    const pageInit = (context) => {
        const currentrecord = currentRecord.get();
        try {
            currentrecord.getField('custbody_pe_document_type').isDisabled = true;
        } catch (e) {
            log.error('Error-pageInit', e);
        }
    }
    const saveRecord = (context) => { }
    const validateField = (context) => { }

    const fieldChanged = (context) => {
        const currentrecord = currentRecord.get();
        const customer = currentrecord.getValue({ fieldId: 'entity' });
        const location = currentrecord.getValue({ fieldId: 'location' });
        try {
            if (customer.length != 0) {
                const doctype = getDocumentType(currentrecord.getValue({ fieldId: 'entity' }));
                currentrecord.setValue({ fieldId: 'custbody_pe_document_type', value: doctype, ignoreFieldChange: true });
                if (location.length != 0) {
                    const documentType = currentrecord.getValue({ fieldId: 'custbody_pe_document_type' });
                    const getserie = getSerie(documentType, location);
                    const correlative = getCorrelative(getserie.peinicio);
                    currentrecord.setValue({ fieldId: 'custbody_pe_number', value: correlative, ignoreFieldChange: true });
                    currentrecord.setValue({ fieldId: 'custbody_pe_serie_cash', value: getserie.serieid, ignoreFieldChange: true });
                } else {
                    currentrecord.setValue({ fieldId: 'custbody_pe_number', value: '', ignoreFieldChange: true });
                    currentrecord.setValue({ fieldId: 'custbody_pe_serie_cash', value: '', ignoreFieldChange: true });
                }
            } else {
                currentrecord.setValue({ fieldId: 'custbody_pe_document_type', value: '', ignoreFieldChange: true });
            }
        } catch (e) {
            log.error('Error-fieldChanged', e);
        }
    }

    const getDocumentType = (customerid) => {
        try {
            const searchField = search.lookupFields({ type: search.Type.CUSTOMER, id: customerid, columns: ['custentity_pe_document_type'] });
            if (searchField.custentity_pe_document_type[0].value == DOCUMENT_TYPE_RUC) {
                return DOCUMENT_TYPE_FACTURA;
            } else if (searchField.custentity_pe_document_type[0].value == DOCUMENT_TYPE_DNI) {
                return DOCUMENT_TYPE_BOLETA;
            }
        } catch (e) {
            log.error({ title: 'Error-getDocumentType', details: e });
        }
    }

    const getSerie = (documenttype, location) => {
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
                        sort: search.Sort.DESC
                    },
                    'custrecord_pe_inicio',
                    'custrecord_pe_tipo_documento_serie'
                ]
            });

            const searchResult = searchLoad.run().getRange({ start: 0, end: 1 });
            const column01 = searchResult[0].getValue(searchLoad.columns[0]);
            let column02 = searchResult[0].getValue(searchLoad.columns[1]);
            column02 = parseInt(column02);
            return {
                serieid: column01,
                peinicio: column02
            };
        } catch (e) {
            log.error({ title: 'getPeSerie', details: e });
        }
    }

    const getCorrelative = (get_pe_inicio) => {
        let ceros;

        if (get_pe_inicio.toString().length == 1) {
            ceros = '0000000';
        } else if (get_pe_inicio.toString().length == 2) {
            ceros = '000000';
        }
        else if (get_pe_inicio.toString().length == 3) {
            ceros = '00000';
        }
        else if (get_pe_inicio.toString().length == 4) {
            ceros = '0000';
        }
        else if (get_pe_inicio.toString().length == 5) {
            ceros = '000';
        }
        else if (get_pe_inicio.toString().length == 6) {
            ceros = '00';
        }
        else if (get_pe_inicio.toString().length == 7) {
            ceros = '0';
        } else if (get_pe_inicio.toString().length >= 8) {
            ceros = '';
        }

        const correlative = ceros + (get_pe_inicio + 1);
        return correlative;
    }


    return {
        //pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
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
