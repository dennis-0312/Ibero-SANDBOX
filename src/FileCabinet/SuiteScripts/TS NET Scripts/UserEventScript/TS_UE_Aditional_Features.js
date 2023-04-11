/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/search'], function (search) {

    const CASH_SALE = 'cashsale';
    const FACTURA_VENTA = 'invoice';
    const CASH_REFUND = 'cashrefund';
    const ID_CLIENT_MAIN = 9434;       // SB:21205 --> CL-447 Cliente Varios, PR:9434 --> CL-1207 Cliente Varios
    const ID_EFECTIVO = 1;              //  Efectivo
    const LOCATION_AEROPUERTO = 11;     // Ibero Aeropuerto
    const TAX_AEROPUERTO = 'IGV_PE:Inaf-PE';
    const ID_TAX_AEROPUERTO = 16;
    const PRECIO_AEROPUERTO = 6;


    function beforeLoad(context) {
        try {
            const objRecord = context.newRecord;
            const eventType = context.type;
            const typeTransaction = objRecord.type;

            if (eventType == 'create' || eventType == 'copy') {

                if (typeTransaction == CASH_SALE) {

                    objRecord.setValue('entity', ID_CLIENT_MAIN);
                    objRecord.setValue('custbody_il_tipo_pago', ID_EFECTIVO);

                }
                // } else if (typeTransaction == CASH_REFUND) {

                //     const id_creado_desde = objRecord.getValue('createdfrom');

                //     if (id_creado_desde) {
                //         var document_ref = search.lookupFields({
                //             type: CASH_SALE,
                //             id: id_creado_desde,
                //             columns: ['trandate']
                //         });
                //         log.debug('document_ref', document_ref);
                //     }
                //     objRecord.setValue('custbody_pe_document_number_ref', objRecord.getValue('custbody_pe_number'), true);
                //     objRecord.setText('custbody_pe_document_date_ref', document_ref['trandate']);
                //     objRecord.setValue('custbody_pe_document_series_ref', objRecord.getText('custbody_pe_serie'), true);
                //     objRecord.setValue('custbody_pe_document_type_ref', objRecord.getValue('custbody_pe_document_type'), true);

                //     objRecord.setValue('custbody_pe_number', '', true);
                //     objRecord.setValue('custbody_pe_serie', '', true);
                //     objRecord.setValue('custbody_pe_document_type', '', true);


                // }

            }

        } catch (e) {
            log.error('Error en beforeLoad', e);
        }

    }

    function beforeSubmit(context) {

        try {

            const objRecord = context.newRecord;
            const eventType = context.type;
            const typeTransaction = objRecord.type;

            if (eventType != 'delete') {

                if (typeTransaction === CASH_SALE || typeTransaction === FACTURA_VENTA) {
                    var get_lines_item = objRecord.getLineCount('item');
                    for (var i = 0; i < get_lines_item; i++) {
                        var location_line = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'location', line: i });
                        var type_item = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i });
                        log.debug('type_item', type_item);
                        if (location_line == LOCATION_AEROPUERTO) objRecord.setSublistValue({ sublistId: 'item', fieldId: 'taxcode', value: ID_TAX_AEROPUERTO, line: i });
                        // if (location == LOCATION_AEROPUERTO && type_item == 'InvtPart'){
                        //     objRecord.setSublistValue({ sublistId: 'item', fieldId: 'price', value: PRECIO_AEROPUERTO, line: i });
                        // } 
                    }
                }
            }
        } catch (e) {
            log.error('Error en beforeSubmit', e);
        }

    }

    function afterSubmit(context) {

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});