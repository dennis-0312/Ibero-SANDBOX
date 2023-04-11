/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = =\
||                                                                                                                  ||
||   This script for Employee (Validate length PE ID DOC)                                                           ||
||                                                                                                                  ||                                      
||   File Name: evol_bg_cs_employee_length.js                                                                       ||
||                                                                                                                  ||
||   Commit      Version     Date            ApiVersion         Enviroment       Governance points                  ||
||   01          1.0         06/01/2021      Script 2.1         PROD             N/A                                ||
||                                                                                                                  ||
\  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = = */
/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/log', 'N/ui/dialog'], function (log, dialog) {
    const saveRecord = (context) => {
        try {
            const currentRecord = context.currentRecord;
            const docType = currentRecord.getValue({ fieldId: 'custentity_pe_document_type' });
            if (docType == '') {
                let options = {
                    title: 'ADVERTENCIA',
                    message: 'DEBE SELECCIONAR UN TIPO DE DOCUMENTO.'
                }
                dialog.alert(options);
                return false;
            } else {
                if (docType == 2) {
                    var docNumber = currentRecord.getValue({ fieldId: 'custentity_pe_document_number' });
                    if (docNumber.length != 8) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL CAMPO NUMERO DE IDENTIFICACION DE IVA DEBE CONTENER 8 CARACTERES SEGUN EL TIPO DOCUMENTO SUNAT INGRESADO.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                } else if (docType == 4) {
                    var docNumber = currentRecord.getValue({ fieldId: 'custentity_pe_document_number' });
                    if (docNumber.length != 11) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL CAMPO NUMERO DE IDENTIFICACION DE IVA DEBE CONTENER 11 CARACTERES SEGUN EL TIPO DOCUMENTO SUNAT INGRESADO.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                }
                return true;
            }
        } catch (e) {
            log.error('Error-saveRecord', e);
        }

    }

    return {
        saveRecord: saveRecord
    }
});
/***************************************************************************************************************
TRACKING
/***************************************************************************************************************
/* Commit:01
Version: 1.0
Date: 06/01/2021
Author: Dennis Fernández
Description: Creación del script y se carga a prod.
==============================================================================================================*/
