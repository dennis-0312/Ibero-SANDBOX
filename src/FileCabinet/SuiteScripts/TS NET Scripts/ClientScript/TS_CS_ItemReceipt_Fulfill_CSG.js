/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record'], (currentRecord, record) => {

    // const pageInit = (scriptContext) => {
    //     const record = currentRecord.get();
    //     try {
    //         console.log('Page Init');
    //         let inventoryDetailRec = record.getCurrentSublistSubrecord({
    //             sublistId: 'item',
    //             fieldId: 'inventorydetail',
    //             line: 0
    //         })
    //         // console.log(inventoryDetailRec);
    //         let binNumber = inventoryDetailRec.getCurrentSublistValue({
    //             sublistId: 'inventoryassignment',
    //             fieldId: 'binnumber',
    //             line: 0
    //         })
    //         console.log(binNumber);


    //     } catch (error) {
    //         console.log('Error-pageInit: ' + error);
    //     }
    // }

    const saveRecord = (scriptContext) => {
        let recordType = scriptContext.currentRecord.type;
        //console.log(recordType);
        if (recordType == 'itemreceipt') {
            try {
                let validate = true;
                let esconsignacion = scriptContext.currentRecord.getValue({ fieldId: 'custbody_pe_es_consignacion' });
                let numLines = scriptContext.currentRecord.getLineCount({ sublistId: 'item' });

                if (numLines != 0) {
                    for (let i = 0; i < numLines; i++) {
                        let invDetailRec = scriptContext.currentRecord.getCurrentSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: i });
                        let binNumber = invDetailRec.getCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: i });

                        if (esconsignacion == true) {
                            if (binNumber != 7) {
                                alert('Ingrese zona de consignación.');
                                validate = false;
                                break;
                            }
                        } else {
                            if (binNumber == 7) {
                                alert('No puedes guardar en zona de consignación.');
                                validate = false;
                                break;
                            }
                        }
                    }
                    return validate;
                }
            } catch (error) {
                console.log('Error-ItemReceipt: ' + error);
            }
        } else if (recordType == 'itemfulfillment') {
            //alert('Estás en itemfulfillment');
            try {
                //console.log('=====================================================');
                let json = new Array();
                let jsonLines = new Array();
                let jsonStringify = '';
                let numLines = scriptContext.currentRecord.getLineCount({ sublistId: 'item' });

                console.log('numLines: ' + numLines);
                for (let i = 0; i < numLines; i++) {
                    let itemreceiveCheck = '';
                    let item = '';
                    let location = '';
                    let inventoryDetailRec = '';
                    let binNumber = '';
                    let quantity = '';

                    itemreceiveCheck = scriptContext.currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemreceive', line: i });

                    if (itemreceiveCheck == true) {
                        item = scriptContext.currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
                        location = scriptContext.currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'location', line: i });
                        inventoryDetailRec = scriptContext.currentRecord.getCurrentSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: i });
                        binNumber = inventoryDetailRec.getCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: i });
                        console.log('binNumber: ' + binNumber);
                        if (binNumber == 7) {
                            quantity = inventoryDetailRec.getCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity', line: i });
                            json.push({
                                'location': location,
                                'item': item,
                                'quantity': quantity
                            });
                            jsonLines.push({
                                'line': i
                            });
                            jsonStringify = JSON.stringify(jsonLines);
                        }
                    }
                }

                console.log('Json: ' + json);
                if (json.length != 0) {
                    let responseBinTransfer = binTransfer(json);
                    if (isNaN(parseInt(responseBinTransfer)) == false && parseInt(responseBinTransfer) != 0) {
                        console.log('DebugBinTransfer', responseBinTransfer);
                        scriptContext.currentRecord.setValue({
                            fieldId: 'custbody_pe_flag_lines_csg',
                            value: jsonStringify,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true
                        });
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            } catch (error) {
                console.error('Error: ' + error);
                return false;
            }
        }
        //return false;
    }


    const binTransfer = (json) => {
        let recId = 0;
        try {
            let rec = record.create({ type: record.Type.BIN_TRANSFER, isDynamic: true });

            rec.setValue({ fieldId: 'location', value: json[0].location });
            rec.setValue({ fieldId: 'memo', value: 'Consignación.' });
            //===================================================================================================================
            for (let i in json) {
                rec.selectNewLine({ sublistId: 'inventory' });
                rec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'item', value: json[i].item });
                rec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'quantity', value: json[i].quantity });
                //=====================================================================================================
                let subrec = rec.getCurrentSublistSubrecord({ sublistId: 'inventory', fieldId: 'inventorydetail' });
                subrec.selectNewLine({ sublistId: 'inventoryassignment' });
                subrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', value: 7 });
                subrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'tobinnumber', value: 1 });
                subrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity', value: json[i].quantity });
                subrec.commitLine({ sublistId: 'inventoryassignment' });
                rec.commitLine({ sublistId: 'inventory' });
                //===================================================================================================================
            }
            recId = rec.save();
            console.log('BinTransfer: ' + recId);
            return recId;
        } catch (error) {
            console.error('Error-binTransfer: ' + error);
            return false;
        }
    }

    // function validateField(context) {

    // }

    // function fieldChanged(context) {

    // }

    // function postSourcing(context) {

    // }

    // function lineInit(context) {

    // }

    // function validateDelete(context) {

    // }

    // function validateInsert(context) {

    // }

    // function validateLine(context) {

    // }

    // function sublistChanged(context) {

    // }

    return {
        //pageInit: pageInit,
        saveRecord: saveRecord,
        // validateField: validateField,
        //fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
