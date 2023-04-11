/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/search'], function (search) {

    const ITEM_FULFILLMENT = 'itemfulfillment';
    const SALES_ORDER = 'salesorder';
    const VENDOR_AUTORIZATION = 'vendorreturnauthorization';
    const TRANSFER_ORDER = 'transferorder';
    const RCD_MOTIVO_TRASLADO = 'customrecord_pe_codigo_motivo_traslado';
    const PE_Item_Fulfillment_FEL_Template = 4;     //  SB: 4, PR: 4
    const PE_FEL_Sending_Method_Guias = 6;          //  SB: 7, PR: 6
    const PE_Facturacion_Electronica = 2;           // SB: 2, PR: 2
    const GUIA_REMISION_REMITENTE = 104;            // SB: 104, PR:104
    const For_Generation_Status = 1;


    function beforeLoad(context) {

        try {

            const objRecord = context.newRecord;
            const eventType = context.type;

            if (eventType == context.UserEventType.CREATE) {

                if (objRecord.type == ITEM_FULFILLMENT) {

                    var created_from = objRecord.getValue('createdfrom');
                    var id_motivo_traslado = '';

                    var tipo_transaccion_origen_busqueda = search.lookupFields({
                        type: 'transaction',
                        id: created_from,
                        columns: ['recordtype']
                    });
                    var tipo_transaccion_origen = tipo_transaccion_origen_busqueda['recordtype'];

                    objRecord.setValue({ fieldId: 'custbody_pe_tipo_conductor', value: 'Principal', ignoreFieldChange: true });
                    // 1: Venta, 2: Compra,  3:Traslado entre establecimientos de la misma empresa	
                    if (tipo_transaccion_origen === SALES_ORDER) {
                        id_motivo_traslado = 1;
                    } else if (tipo_transaccion_origen === VENDOR_AUTORIZATION) {
                        id_motivo_traslado = 2;
                    } else if (tipo_transaccion_origen === TRANSFER_ORDER) {
                        id_motivo_traslado = 3;
                    }

                    objRecord.setValue({ fieldId: 'custbody_pe_motivo_traslado', value: id_motivo_traslado, ignoreFieldChange: true });
                    objRecord.setValue({ fieldId: 'custbody_pe_descrp_motivo_traslado', value: getMotivoTraslado(id_motivo_traslado)['nombre'], ignoreFieldChange: true });
                    // objRecord.setValue({ fieldId: 'custbody_psg_ei_template', value: PE_Item_Fulfillment_FEL_Template, ignoreFieldChange: true });
                    // objRecord.setValue({ fieldId: 'custbody_psg_ei_sending_method', value: PE_FEL_Sending_Method_Guias, ignoreFieldChange: true });

                }
            }

        } catch (e) {
            log.error('error en beforeLoad', e);
        }

    }

    function beforeSubmit(context) {

        try {
            const objRecord = context.newRecord;
            const eventType = context.type;

            if (eventType == context.UserEventType.CREATE) {

                if (objRecord.type == ITEM_FULFILLMENT) {

                    var ref_no = '';
                    const docu_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                    if (docu_type == GUIA_REMISION_REMITENTE) {
                        const serie = objRecord.getText({ fieldId: 'custbody_pe_serie' });
                        const pe_number = objRecord.getValue({ fieldId: 'custbody_pe_number' });
                        ref_no = 'GR-' + serie + '-' + pe_number;
                    }
                    objRecord.setValue({ fieldId: 'tranid', value: ref_no });
                    objRecord.setValue({ fieldId: 'custbody_psg_ei_template', value: PE_Item_Fulfillment_FEL_Template, ignoreFieldChange: true });
                    objRecord.setValue({ fieldId: 'custbody_psg_ei_status', value: For_Generation_Status, ignoreFieldChange: true });
                    objRecord.setValue({ fieldId: 'custbody_psg_ei_sending_method', value: PE_FEL_Sending_Method_Guias, ignoreFieldChange: true });

                }

                if (objRecord.type == TRANSFER_ORDER) {
                    objRecord.setValue({ fieldId: 'custbody_psg_ei_trans_edoc_standard', value: PE_Facturacion_Electronica, ignoreFieldChange: true });
                }
            }

        } catch (e) {
            log.error('error en beforeSubmit', e);
        }

    }

    function afterSubmit(context) {

    }



    function getMotivoTraslado(_id_motivo) {
        try {

            var objMotivoTraslado = search.lookupFields({
                type: RCD_MOTIVO_TRASLADO,
                id: _id_motivo,
                columns: ['name', 'custrecord_pe_codigo_motivo_traslado']
            });
            return {
                nombre: objMotivoTraslado['name'],
                codigo_motivo: objMotivoTraslado['custrecord_pe_codigo_motivo_traslado']
            }

        } catch (e) {
            log.error('error en getMotivoTraslado', e)
        }
    }


    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});