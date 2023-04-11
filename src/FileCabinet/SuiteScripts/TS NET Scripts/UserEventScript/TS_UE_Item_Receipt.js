/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/search'], (log, search) => {
    //APLICADO A Item Receipt
    const beforeLoad = (context) => {
        const receiveRecord = context.newRecord;
        const authorizationid = receiveRecord.getValue({ fieldId: 'createdfrom' });
        try {
            const invoiceid = getInvoiceID(authorizationid);
            if (invoiceid != 0) {
                const fields = getFieldsInvoice(invoiceid);
                //log.debug({ title: 'Test', details: fields });

                receiveRecord.setValue({ fieldId: 'custbody_pe_document_type_ref', value: fields.documenttype, ignoreFieldChange: true });
                receiveRecord.setValue({ fieldId: 'custbody_pe_document_series_ref', value: fields.documentserie, ignoreFieldChange: true });
                receiveRecord.setValue({ fieldId: 'custbody_pe_document_number_ref', value: fields.documentnumber, ignoreFieldChange: true });
                receiveRecord.setValue({ fieldId: 'custbody_pe_document_date_ref', value: fields.documentdate, ignoreFieldChange: true });

                receiveRecord.setValue({ fieldId: 'custbody_pe_document_type', value: ' ', ignoreFieldChange: true });
                receiveRecord.setValue({ fieldId: 'custbody_pe_number', value: ' ', ignoreFieldChange: true });
            }
        } catch (e) {
            log.error({ title: 'beforeLoad', details: e });
        }

        // log.debug({ title: 'Test', details: 'Hola desde Item receipt' });
    }


    const beforeSubmit = (context) => {
        const newRecord = context.newRecord;
        try {
            // const document_type = newRecord.getValue({ fieldId: 'custbody_pe_document_type' });
            // const operation_type = newRecord.getValue({ fieldId: 'custbody_pe_operation_type' });

            // if (document_type == '') {
            //     newRecord.setValue({ fieldId: 'custbody_pe_document_type', value: 105, ignoreFieldChange: true });
            // }

            // if (operation_type == '') {
            //     newRecord.setValue({ fieldId: 'custbody_pe_operation_type', value: 47, ignoreFieldChange: true });
            // }

            newRecord.setValue({ fieldId: 'custbody_pe_document_type', value: 105, ignoreFieldChange: true }); // Guia de Remision - Transportista
            newRecord.setValue({ fieldId: 'custbody_pe_operation_type', value: 3, ignoreFieldChange: true }); // Compra Nacional
        } catch (e) {
            log.error('Error-beforeSubmit', e);
        }
    }


    const getInvoiceID = (authorizationid) => {
        try {
            const returnauthorizationSearchObj = search.create({
                type: "returnauthorization",
                filters:
                    [
                        ["type", "anyof", "RtnAuth"],
                        "AND",
                        ["internalid", "anyof", authorizationid],
                        "AND",
                        ["createdfrom", "noneof", "@NONE@"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "createdfrom",
                            summary: "GROUP"
                        })
                    ]
            });
            const searchResultCount = returnauthorizationSearchObj.runPaged().count;
            if (searchResultCount != 0) {
                const searchResult = returnauthorizationSearchObj.run().getRange({ start: 0, end: 1 });
                const invoiceid = searchResult[0].getValue({ name: 'createdfrom', summary: 'GROUP' });
                //log.debug({ title: 'getInvoice', details: invoiceid });

                return invoiceid;
            } else {
                return 0;
            }


        } catch (e) {
            log.error({ title: 'getInvoiceID', details: e });
        }
    }


    const getFieldsInvoice = (invoiceid) => {
        let json = new Array();
        try {
            const invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["internalid", "anyof", invoiceid]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custbody_pe_document_type",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custbody_pe_serie",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custbody_pe_number",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "GROUP"
                        })
                    ]
            });

            const searchResult = invoiceSearchObj.run().getRange({ start: 0, end: 1 });

            //return searchResult;

            const documenttype = searchResult[0].getValue({ name: 'custbody_pe_document_type', summary: 'GROUP' });
            const documentserie = searchResult[0].getText({ name: 'custbody_pe_serie', summary: 'GROUP' });
            const documentnumber = searchResult[0].getValue({ name: 'custbody_pe_number', summary: 'GROUP' });
            const documentdate = searchResult[0].getValue({ name: 'trandate', summary: 'GROUP' });

            json = {
                documenttype: documenttype,
                documentserie: documentserie,
                documentnumber: documentnumber,
                documentdate: documentdate
            }

            return json;

        } catch (e) {
            log.error({ title: 'getFieldsInvoice', details: e });
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
});
