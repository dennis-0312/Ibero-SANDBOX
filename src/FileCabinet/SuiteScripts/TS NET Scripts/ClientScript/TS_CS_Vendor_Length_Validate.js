/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = == = = = = = = = = = = =\
||                                                                                                                  ||
||   This script for Vendor (Validate length DOC)                                                                   ||
||                                                                                                                  ||                                      
||   File Name: evol_bg_cs_vendor_length.js                                                                         ||
||                                                                                                                  ||
||   Commit      Version     Date            ApiVersion         Enviroment       Governance points                  ||
||   01          1.0         06/01/2021      Script 2.1         PROD               N/A                              ||
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
                    const docNumber = currentRecord.getValue({ fieldId: 'vatregnumber' });
                    const typePerson = currentRecord.getValue({ fieldId: 'custentity_pe_type_of_person' });
                    if (docNumber.length != 8) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL CAMPO NUMERO DE IDENTIFICACION DE IVA DEBE CONTENER 8 CARACTERES SEGUN EL TIPO DOCUMENTO SUNAT INGRESADO.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                    if (typePerson != 1) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL TIPO PERSONA DEBE SER NATURAL.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                } else if (docType == 4) {
                    const docNumber = currentRecord.getValue({ fieldId: 'vatregnumber' });
                    const typePerson = currentRecord.getValue({ fieldId: 'custentity_pe_type_of_person' });
                    if (docNumber.length != 11) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL CAMPO NUMERO DE IDENTIFICACION DE IVA DEBE CONTENER 11 CARACTERES SEGUN EL TIPO DOCUMENTO SUNAT INGRESADO.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                    if (typePerson != 2) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL TIPO PERSONA DEBE SER JURIDICA.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                } else if (docType == 3) {
                    const docNumber = currentRecord.getValue({ fieldId: 'vatregnumber' });
                    const typePerson = currentRecord.getValue({ fieldId: 'custentity_pe_type_of_person' });
                    if (docNumber.length != 12) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL CAMPO NUMERO DE IDENTIFICACION DE IVA DEBE CONTENER 12 CARACTERES SEGUN EL TIPO DOCUMENTO SUNAT INGRESADO.'
                        }
                        dialog.alert(options);
                        return false;
                    }
                    if (typePerson != 3) {
                        let options = {
                            title: 'ADVERTENCIA',
                            message: 'EL TIPO PERSONA DEBE SER EXTRANJERO.'
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
