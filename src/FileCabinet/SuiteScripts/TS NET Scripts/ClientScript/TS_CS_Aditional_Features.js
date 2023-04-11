/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/runtime', 'N/search'], function (runtime, search) {

    const VENTA_EFECTIVO = 'cashsale';
    const AUTORIZACION_DEVOLUCION_PROVEEDOR = 'vendorreturnauthorization';
    const FACTURA_VENTA = 'invoice';
    const ITEM = 'item';
    const ID_CLIENT_MAIN = 9434;       // SB:21205 --> CL-447 Cliente Varios, PR:9434 --> CL-1207 Cliente Varios
    const LOCATION_AEROPUERTO = 11;     // Ibero Aeropuerto
    const PRECIO_AEROPUERTO = 6;
    const ID_TAX_AEROPUERTO = 7;



    function pageInit(context) {
        try {

            var currentRecord = context.currentRecord;
            var type_transaction = currentRecord.type;

            var fieldNmroVuelo = currentRecord.getField('custbody_il_numero_vuelo');
            var fieldPasaporte = currentRecord.getField('custbody_il_pasaporte');
            var fieldPais = currentRecord.getField('custbody_il_pais');
            var fieldNombre = currentRecord.getField('custbody_il_nombre');

            var location = currentRecord.getValue('location');

            if (type_transaction == 'cashsale') {
                if (location != LOCATION_AEROPUERTO) {

                    fieldNmroVuelo.isDisplay = false;
                    fieldPasaporte.isDisplay = false;
                    fieldPais.isDisplay = false;
                    fieldNombre.isDisplay = false;
                }
            }

        } catch (e) {
            console.log('Error en: ' + e);
        }
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

            var getLocation = currentRecord.getValue('location');


            if (typeTransaction == VENTA_EFECTIVO || typeTransaction == FACTURA_VENTA) {

                if (typeTransaction == VENTA_EFECTIVO) {
                    if (sublistName == 'item') {
                        if (typeTransaction == VENTA_EFECTIVO) {
                            if (sublistFieldName === 'item') {
                                try {
                                    currentRecord.setCurrentSublistValue({
                                        sublistId: sublistName,
                                        fieldId: 'location',
                                        value: getLocation
                                    });
                                } catch (e) {
                                    console.log('err', e);
                                }
                            }
                        }
                    }
                }

                if (sublistFieldName == 'custbody_pe_free_operation') {
                    var free_op = currentRecord.getValue(sublistFieldName);
                    var item_free_op = '';
                    if (free_op) item_free_op = 'TRANSG001';
                    currentRecord.setText('discountitem', item_free_op);
                }
            }

        } catch (e) {
            console.log('error en fieldChanged', e);
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
        const currentRecord = context.currentRecord;
        const typeTransaction = currentRecord.type;
        const sublistName = context.sublistId;

        try {
            if (typeTransaction === VENTA_EFECTIVO) {
                if (sublistName === ITEM) {
                    const location = currentRecord.getValue('location');
                    if (location == LOCATION_AEROPUERTO) {
                        currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'price', value: PRECIO_AEROPUERTO });
                        currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'taxcode', value: ID_TAX_AEROPUERTO });
                        currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'taxrate1', value: '0.0' });
                        return true;
                    }
                }
            } else if (typeTransaction === AUTORIZACION_DEVOLUCION_PROVEEDOR && sublistName === ITEM) {
                const user = runtime.getCurrentUser()
                console.log(user);
                var userClass = getUserClass(user.id);
                console.log(userClass);
                if (user.department) currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'department', value: user.department });
                if (userClass) currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'class', value: userClass });
                if (user.location) currentRecord.setCurrentSublistValue({ sublistId: ITEM, fieldId: 'location', value: user.location });
            }
            
            return true;
        } catch (e) {
            console.log('error en validateLine', e);
        }

    }

    function sublistChanged(context) {

    }

    function getUserClass(userId) {
        var userClass = "";
        try {
            var employeeRecord = search.lookupFields({
                type: search.Type.EMPLOYEE,
                id: userId,
                columns: ['class']
            });
            console.log('employeeRecord', employeeRecord)
            if (employeeRecord != "") userClass = employeeRecord.class[0].value;

        } catch (error) {
            console.log(error);
        }
        return userClass;
    }

    return {
        pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});