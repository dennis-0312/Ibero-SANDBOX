/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search'], function (search) {

    const ITEM_FULFILLMENT = 'itemfulfillment';

    function pageInit(context) {

    }

    function saveRecord(context) {

    }

    function validateField(context) {

    }

    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var typeTransaction = currentRecord.type;
            var sublistFieldName = context.fieldId;
            var line = context.line;
            var lineNum = context.lineNum;


            if (typeTransaction == ITEM_FULFILLMENT) {

                if (sublistFieldName == 'custbody_pe_modalidad_traslado') {

                    // TRANSPORTE PÚBLICO
                    var fieldRucEmpTransporte = currentRecord.getField('custbody_pe_ruc_empresa_transporte');
                    var fieldTipoDocTransportista = currentRecord.getField('custbody_pe_tipo_doc_transportista');
                    var fieldDenominTranportador = currentRecord.getField('custbody_pe_denominacion_transportador');
                    // TRANSPORTE PRIVADO
                    var fieldPlacaVeh = currentRecord.getField('custbody_pe_car_plate');
                    var fieldDriverDocNumber = currentRecord.getField('custbody_pe_driver_document_number');
                    var fieldDocIdentCond = currentRecord.getField('custbody_pe_doc_identidad_conductor');


                    var modalidad_traslado = currentRecord.getValue(sublistFieldName);
                    var modalidad_traslado_busq = search.lookupFields({
                        type: 'customrecord_pe_modalidad_traslado',
                        id: modalidad_traslado,
                        columns: ['custrecord_pe_cod_mod_traslado']
                    });
                    var modalidad_traslado_codigo = modalidad_traslado_busq['custrecord_pe_cod_mod_traslado']; // Público: 01, Privado: 02
                    if (modalidad_traslado_codigo == '01') {

                        fieldPlacaVeh.isDisplay = false;
                        fieldDriverDocNumber.isDisplay = false;
                        fieldDocIdentCond.isDisplay = false;

                        fieldRucEmpTransporte.isDisplay = true;
                        fieldTipoDocTransportista.isDisplay = true;
                        fieldDenominTranportador.isDisplay = true;

                    } else {

                        fieldPlacaVeh.isDisplay = true;
                        fieldDriverDocNumber.isDisplay = true;
                        fieldDocIdentCond.isDisplay = true;

                        fieldRucEmpTransporte.isDisplay = false;
                        fieldTipoDocTransportista.isDisplay = false;
                        fieldDenominTranportador.isDisplay = false;

                    }
                }
            }

        } catch (e) {
            console.log('Error en fieldChanged: ' + e);

        }

    }

    function postSourcing(context) {

    }

    function lineInit(context) {

    }

    function validateDelete(context) {

    }

    function validateInsert(context) {

    }

    function validateLine(context) {

    }

    function sublistChanged(context) {

    }

    return {
        // pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
