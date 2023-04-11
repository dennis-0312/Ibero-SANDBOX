/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/record'], function (log, record) {
    
    function afterSubmit(context) {
        var response = {}
        var objRecord = context.newRecord;
        var recordId = objRecord.id;
        var recordType = objRecord.type;

        try {
            var recordLoad = record.load({ type: recordType, id: recordId, isDynamic: true });
            var docu_type = recordLoad.getValue({ fieldId: 'custbody_pe_document_type' });
            var serie_cxp = recordLoad.getValue({ fieldId: 'custbody_pe_serie_cxp' });
            var pe_number = recordLoad.getValue({ fieldId: 'custbody_pe_number' });

            var reference_no = generateReference(docu_type, serie_cxp, pe_number);

            recordLoad.setValue({ fieldId: 'tranid', value: reference_no });
            response = recordLoad.save();

            log.debug({ title: 'Update', details: response });
        }
        catch (e) {
            log.error({ title: 'Error', details: e });
        }
    }


    function generateReference(docu_type, pe_serie, pe_number) {
        var boleta_venta = 101;
        var factura = 103;
        var nota_credito = 106;
        var nota_debito = 107;
        var comprobante_no_domiciliado = 9
        var ref_no;

        if (docu_type == boleta_venta) {
            ref_no = 'BV-' + pe_serie + '-' + pe_number;
        }
        else if (docu_type == factura) {
            ref_no = 'FA-' + pe_serie + '-' + pe_number;
        }
        else if (docu_type == nota_credito) {
            ref_no = 'NC-' + pe_serie + '-' + pe_number;
        }
        else if (docu_type == nota_debito) {
            ref_no = 'ND-' + pe_serie + '-' + pe_number;
        }
        else if (docu_type == comprobante_no_domiciliado) {
            ref_no = 'CN-' + pe_serie + '-' + pe_number;
        }

        return ref_no;

    }

    return {
        afterSubmit: afterSubmit
    }
});
