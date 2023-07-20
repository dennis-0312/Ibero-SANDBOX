/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@NModuleScope Public
*/
define(['N/url', 'N/record', 'N/currentRecord', 'N/transaction', 'N/https', 'N/search'],
    (url, record, currentRecord, transaction, https, search) => {
        const CASH_SALE = 'cashsale';
        const CREDIT_MEMO = 'creditmemo';
        const pageInit = (scriptContext) => {
            alert('hola mundo'); //!Importante, no borrar.
        }

        const reimprimir = (idRecord, type) => {
            var recordLoad;
            console.log('entra');
            if(type == CASH_SALE ){    
                console.log('type',type);  
                recordLoad = record.load({ type: record.Type.CASH_SALE, id: idRecord, isDynamic: true });
            }else if(type == CREDIT_MEMO ){
                console.log('type',type); 
                recordLoad = record.load({ type: record.Type.CREDIT_MEMO, id: idRecord, isDynamic: true });
            }
          
            var tranid = recordLoad.getValue({ fieldId: 'tranid' });
            var location = recordLoad.getValue({ fieldId: 'location' });
            var type = recordLoad.type;
            let predeterminada = '@NONE@'
            //let searchlookupFields = search.lookupFields({ type: record.Type.CASH_SALE, id: idRecord, columns: ['tranid', 'location'] });
            //var location = searchlookupFields.location[0].value
            var printer = getPrinter(location);
            if (printer == 0) {
                printer = getPrinter(predeterminada);
            }
            let parameters = getFiltersValue(idRecord, tranid, printer, type);
            console.log('parameters', parameters)
            let suiteletURL = getSuiteletURL('customdeploy_ts_ui_automatic_print');
            suiteletURL = addParametersToUrl(suiteletURL, parameters);
            setWindowChanged(window, false);
            window.location.href = suiteletURL;

        }
        const getFiltersValue = (idRecord, tranid, printer, type) => {
            let values = {
                custparam_internalid: idRecord,
                custparam_tranid: tranid,
                custparam_printer: printer,
                custparam_rectype: type
            };
            return values;
        }

        const getSuiteletURL = (deploymentId) => {
            return url.resolveScript({
                scriptId: 'customscript_ts_ui_automatic_print',
                deploymentId,
                returnExternalUrl: false
            });
        }


        const addParametersToUrl = (suiteletURL, parameters) => {
            for (let param in parameters) {
                if (parameters[param]) {
                    suiteletURL = `${suiteletURL}&${param}=${parameters[param]}`;
                }
            }
            return suiteletURL;
        }

        const getPrinter = (location) => {
            const PE_CONFIG_IMPRESORA = 'customsearch_pe_config_impresora'
            let mySearch = search.load({ id: PE_CONFIG_IMPRESORA });
            let filters = mySearch.filters;
            const filterOne = search.createFilter({ name: 'custrecord_pe_config_imp_tienda', operator: search.Operator.ANYOF, values: location });
            filters.push(filterOne);
            const resultCount = mySearch.runPaged().count;
            if (resultCount > 0) {
                const searchResult = mySearch.run().getRange({ start: 0, end: 1 });
                let printer = searchResult[0].getValue({ name: "custrecord_pe_config_imp_impresora" });
                return printer
            } else {
                return 0;
            }
        }
        return {
            pageInit: pageInit,
            reimprimir: reimprimir
        };

    });
/********************************************************************************************************************************************************
TRACKING
/********************************************************************************************************************************************************
/* Commit:01
Version: 1.0
Date: 27/06/2022
Author: Jeferson Mejia
Description: Creación del script.
========================================================================================================================================================*/