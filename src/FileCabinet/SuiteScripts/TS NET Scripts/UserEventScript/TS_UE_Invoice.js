/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = =\
||                                                                                                                  ||
||   This script for Invooice (Valida correlativo sw serie y lo setea)                                              ||
||                                                                                                                  ||
||   File Name: evol_bg_ue_invoice.js                                                                               ||
||                                                                                                                  ||
||   Commit      Version     Date            ApiVersion         Enviroment       Governance points                  ||
||   01          2.0         23/12/2021      Script 2.1         PROD             N/A                                ||
||                                                                                                                  ||
\  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = = */
/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/record'], (log, record) => {

    const beforeLoad = (context) => {
        const FACTURA = 103;
        const BOLETA = 101;
        const newRecord = context.newRecord;
        const recordId = newRecord.id;
        const recordType = newRecord.type;
        let tranid = newRecord.getValue({ fieldId: 'tranid' });
        let total = String(newRecord.getValue({ fieldId: 'total' }));
        const penumber = newRecord.getValue({ fieldId: 'custbody_pe_number' });
        try {
            const recordLoadTotal = record.load({ type: recordType, id: recordId, isDynamic: true, });
            recordLoadTotal.setValue({ fieldId: 'custbody_pe_flag_total', value: total });
            log.debug('Total', total);
            recordLoadTotal.save();
            // log.debug('Prueba', tranid);
            tranid = tranid.split('-');
            tranid = tranid.pop();
            if (tranid != penumber) {
                let newtranid = '';
                //const recordId = newRecord.id;
                const type = newRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                const serie = newRecord.getText({ fieldId: 'custbody_pe_serie' });

                if (type == BOLETA) {
                    newtranid = 'BV-' + serie + '-' + penumber;
                } else if (type == FACTURA) {
                    newtranid = 'FA-' + serie + '-' + penumber;
                }
                const recordLoad = record.load({ type: recordType, id: recordId, isDynamic: true, });
                recordLoad.setValue({ fieldId: 'tranid', value: newtranid, ignoreFieldChange: true });
                recordLoad.save();
            }
            

        } catch (e) {
            log.error('Error-beforeLoad', e);
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});
/***************************************************************************************************************
TRACKING
/***************************************************************************************************************
/* Commit:01
Version: 1.0
Date: 23/12/2021
Author: Dennis Fernández
Description: Creación del script y pase a producción.
==============================================================================================================*/
