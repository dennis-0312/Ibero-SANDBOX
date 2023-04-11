/********************************************************************************************************************************************************
This script for Item Fulfillment
/******************************************************************************************************************************************************** 
File Name: TS_US_Print_PDF.js                                                                        
Commit: 01                                                        
Version: 1.0                                                                     
Date: 27/06/2022
ApiVersion: Script 2.x
Enviroment: SB
Governance points: N/A
========================================================================================================================================================*/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([],

    function () {

        function beforeLoad(scriptContext) {
            try {
                var form = scriptContext.form;
                var currentRecord = scriptContext.newRecord;
                var type_event = scriptContext.type;

                if (type_event == scriptContext.UserEventType.VIEW) {
                    if (currentRecord.type == 'itemfulfillment') {
                        var btn_name = 'Imprimir';
                        form.addButton({
                            id: 'custpage_ts_print_pdf',
                            label: btn_name,
                            functionName: 'printPdf(' + currentRecord.id + ',"' + currentRecord.type + '", false)'
                        });


                        form.addButton({
                            id: 'custpage_ts_print_pdf_fel',
                            label: btn_name + ' Vista Previa FEL',
                            //functionName: 'printPdfFel(' + currentRecord.id + ',"' + currentRecord.type + '")'
                            functionName: 'printPdf(' + currentRecord.id + ',"' + currentRecord.type + '", true)'
                        });
                        form.clientScriptModulePath = './TS_CS_Print_PDF.js';
                    }

                }

            } catch (err) {
                log.error("Error", "[ beforeLoad ] " + err);
            }

        }


        function beforeSubmit(scriptContext) {

        }

        function afterSubmit(scriptContext) {

        }

        return {
            beforeLoad: beforeLoad,
            //beforeSubmit: beforeSubmit,
            //afterSubmit: afterSubmit
        };

    });
/********************************************************************************************************************************************************
TRACKING
/********************************************************************************************************************************************************
/* Commit:01
Version: 1.0
Date: 27/06/2022
Author: Jean Ñique
Description: Creación del script.
========================================================================================================================================================*/