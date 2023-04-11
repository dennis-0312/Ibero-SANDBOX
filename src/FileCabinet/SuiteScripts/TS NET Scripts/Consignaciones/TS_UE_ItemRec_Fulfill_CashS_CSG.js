/********************************************************************************************************************************************************
This script for Item Receipt and Fulfillment (Validación de artículos consignados) 
/******************************************************************************************************************************************************** 
File Name: TS_UE_ItemRec_Fulfill_CashS_CSG.js                                                                        
Commit: 01                                                        
Version: 1.0                                                                     
Date: 05/05/2022
ApiVersion: Script 2.1
Enviroment: SB
Governance points: N/A
========================================================================================================================================================*/
/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/search', 'N/record'], (log, search, record) => {
    const ITEM_RECEIPT = 'itemreceipt';
    const ITEM_FULFILLMENT = 'itemfulfillment';
    const CASH_SALE = 'cashsale';
    const INVENTORY_TRANSFER = 'inventorytransfer';
    const SALES_ORDER = 'salesorder';
    const TRANSFER_ORDER = 'transferorder';
    const PURCHASE_ORDER = 'purchaseorder'
    const VENDOR_RETURN_AUTHORIZATION = 'vendorreturnauthorization';
    const RETURN_AUTHORIZATION = 'returnauthorization';
    const GUIA_REMISION_REMITENTE = '104';  //(IB=104, BX=56)
    const RCD_MOTIVO_TRASLADO = 'customrecord_pe_codigo_motivo_traslado';
    const PE_Item_Fulfillment_FEL_Template = 4;     //  SB: 4, PR: 4 (IB/BX)
    const PE_FEL_Sending_Method_Guias = 6;          //  SB: 6, PR: 6 (IB=6, BX=5)
    const PE_Facturacion_Electronica = 2;           // SB: 2, PR: 2 (IB/BX)
    const For_Generation_Status = 1;


    const beforeLoad = (context) => {
        const eventType = context.type;
        if (eventType === context.UserEventType.CREATE || eventType === context.UserEventType.COPY) {
            const objRecord = context.newRecord;
            let fieldLookUp = '';
            let typeRecordFrom = '';
            let createdfrom = objRecord.getValue({ fieldId: 'createdfrom' });
            try {
                if (objRecord.type == ITEM_FULFILLMENT) {
                    objRecord.setValue({ fieldId: 'custbody_pe_document_type', value: GUIA_REMISION_REMITENTE, ignoreFieldChange: true, forceSyncSourcing: true });
                    if (createdfrom.length != 0) {
                        fieldLookUp = search.lookupFields({ type: search.Type.SALES_ORDER, id: createdfrom, columns: ['location'] });
                        typeRecordFrom = SALES_ORDER;
                        if (Object.keys(fieldLookUp).length === 0) {
                            fieldLookUp = search.lookupFields({ type: search.Type.VENDOR_RETURN_AUTHORIZATION, id: createdfrom, columns: ['location'] });
                            typeRecordFrom = VENDOR_RETURN_AUTHORIZATION;
                            if (Object.keys(fieldLookUp).length === 0) {
                                fieldLookUp = search.lookupFields({ type: search.Type.TRANSFER_ORDER, id: createdfrom, columns: ['location'] });
                                typeRecordFrom = TRANSFER_ORDER;
                            }
                        }

                        // AGREGADO PARA LA GUIA DE REMISION ELECTRÓNICA
                        var id_motivo_traslado = '';
                        var tipo_transaccion_origen_busqueda = search.lookupFields({
                            type: 'transaction',
                            id: createdfrom,
                            columns: ['recordtype']
                        });
                        var tipo_transaccion_origen = tipo_transaccion_origen_busqueda['recordtype'];
    
                        objRecord.setValue({ fieldId: 'custbody_pe_tipo_conductor', value: 'Principal', ignoreFieldChange: true });
                        // 1: Venta, 2: Compra,  3:Traslado entre establecimientos de la misma empresa	
                        if (tipo_transaccion_origen === SALES_ORDER) {
                            id_motivo_traslado = 1;
                        } else if (tipo_transaccion_origen === VENDOR_RETURN_AUTHORIZATION) {
                            id_motivo_traslado = 2;
                        } else if (tipo_transaccion_origen === TRANSFER_ORDER) {
                            id_motivo_traslado = 3;
                        }
    
                        objRecord.setValue({ fieldId: 'custbody_pe_motivo_traslado', value: id_motivo_traslado, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_descrp_motivo_traslado', value: getMotivoTraslado(id_motivo_traslado)['nombre'], ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_psg_ei_template', value: PE_Item_Fulfillment_FEL_Template, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_psg_ei_status', value: For_Generation_Status, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_psg_ei_sending_method', value: PE_FEL_Sending_Method_Guias, ignoreFieldChange: true });

                    }
                } else if (objRecord.type == ITEM_RECEIPT) {
                    objRecord.setValue({ fieldId: 'custbody_pe_document_type', value: GUIA_REMISION_REMITENTE, ignoreFieldChange: true, forceSyncSourcing: true });
                    if (createdfrom.length != 0) {
                        fieldLookUp = search.lookupFields({ type: search.Type.PURCHASE_ORDER, id: createdfrom, columns: ['location'] });
                        typeRecordFrom = PURCHASE_ORDER;
                        if (Object.keys(fieldLookUp).length === 0) {
                            fieldLookUp = search.lookupFields({ type: search.Type.VENDOR_RETURN_AUTHORIZATION, id: createdfrom, columns: ['location'] });
                            typeRecordFrom = VENDOR_RETURN_AUTHORIZATION;
                            if (Object.keys(fieldLookUp).length === 0) {
                                fieldLookUp = search.lookupFields({ type: search.Type.TRANSFER_ORDER, id: createdfrom, columns: ['transferlocation', 'custbody_pe_serie'] });
                                typeRecordFrom = TRANSFER_ORDER;
                                if (Object.keys(fieldLookUp).length === 0) {
                                    fieldLookUp = search.lookupFields({ type: search.Type.RETURN_AUTHORIZATION, id: createdfrom, columns: ['location'] });
                                    typeRecordFrom = RETURN_AUTHORIZATION;
                                }
                            }
                        }
                    }
                } else if (objRecord.type == TRANSFER_ORDER) {
                    objRecord.setValue({ fieldId: 'custbody_pe_document_type', value: GUIA_REMISION_REMITENTE, ignoreFieldChange: true, forceSyncSourcing: true });
                    objRecord.setValue({ fieldId: 'custbody_psg_ei_trans_edoc_standard', value: PE_Facturacion_Electronica, ignoreFieldChange: true });
                }

                if (Object.keys(fieldLookUp).length !== 0) {
                    let location = '';
                    if (typeRecordFrom == TRANSFER_ORDER && objRecord.type == ITEM_RECEIPT) {
                        location = fieldLookUp.transferlocation[0].value;
                        let document_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                        let pe_number = objRecord.getValue({ fieldId: 'custbody_pe_number' });
                        objRecord.setValue({ fieldId: 'custbody_pe_document_type_ref', value: document_type, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_document_series_ref', value: fieldLookUp.custbody_pe_serie[0].text, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_document_number_ref', value: pe_number, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_serie_cxp', value: 'Por generar', ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_number', value: 'Por generar', ignoreFieldChange: true });
                    } else {
                        location = fieldLookUp.location[0].value;
                    }
                    objRecord.setValue({
                        fieldId: 'custbody_pe_location_source',
                        value: location,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });

                    objRecord.setValue({
                        fieldId: 'custbody_pe_flag_created_from',
                        value: typeRecordFrom,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });
                }
            } catch (error) {
                log.error('Error-beforeLoad-' + objRecord.type, error)
            }
        }
    }


    const beforeSubmit = (context) => {
        const eventType = context.type;
        if (eventType === context.UserEventType.CREATE || eventType === context.UserEventType.COPY) {
            const objRecord = context.newRecord;
            try {
                if (objRecord.type == CASH_SALE) {
                    try {
                        let lines = JSON.parse(objRecord.getValue({ fieldId: 'custbody_pe_flag_lines_csg' }));
                        if (lines.length != 0) {
                            for (let i in lines) {
                                let itemtype = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: i });
                                if (itemtype == 'InvtPart') {
                                    let inventoryDetailRec = objRecord.getSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: lines[i].line });
                                    inventoryDetailRec.setSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: lines[i].subline, value: lines[i].binPropio });
                                }
                            }
                        }
                    } catch (error) { }
                    // try {
                    //     let linecount = objRecord.getLineCount({ sublistId: 'item' });
                    //     let k = 0;
                    //     if (linecount != 0) {
                    //         for (let j = 0; j < linecount; j++) {
                    //             k = j;
                    //             let itemtype = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: j });
                    //             if (itemtype == 'InvtPart') {
                    //                 let itemtypeDSCTO = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: k + 1 });
                    //                 if (itemtypeDSCTO == 'Discount') {
                    //                     let grossDiscount = objRecord.getSublistValue({ sublistId: 'item', fieldId: 'grossamt', line: k + 1 });
                    //                     grossDiscount = Math.abs(grossDiscount);
                    //                     objRecord.setSublistValue({ sublistId: 'item', fieldId: 'custcol_pe_discount_line', line: j, value: grossDiscount });
                    //                     objRecord.setSublistValue({ sublistId: 'item', fieldId: 'custcol_pe_is_discount_line', line: k + 1, value: true });
                    //                 }
                    //             }
                    //         }
                    //     }
                    // } catch (error) { }
                } else if (objRecord.type == ITEM_FULFILLMENT) {
                    let flag_created_from = objRecord.getValue({ fieldId: 'custbody_pe_flag_created_from' });
                    if (flag_created_from == SALES_ORDER) {
                        try {
                            let lines = JSON.parse(objRecord.getValue({ fieldId: 'custbody_pe_flag_lines_csg' }));
                            if (lines.length != 0) {
                                for (let i in lines) {
                                    let inventoryDetail = objRecord.getSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: lines[i].line });
                                    inventoryDetail.setSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: lines[i].subline, value: lines[i].binPropio });
                                }
                            }
                        } catch (error) { }

                        // try {
                        //     let location_source = objRecord.getValue({ fieldId: 'custbody_pe_location_source' });
                        //     let document_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                        //     let returnSerie = generateSerie(document_type, location_source);
                        //     objRecord.setValue({ fieldId: 'custbody_pe_serie', value: returnSerie.peserieId, ignoreFieldChange: true });
                        //     objRecord.setValue({ fieldId: 'custbody_pe_number', value: returnSerie.correlative, ignoreFieldChange: true });
                        //     objRecord.setValue({ fieldId: 'custbody_pe_flag_serie', value: returnSerie.serieImpresion, ignoreFieldChange: true });
                        // } catch (error) { }
                    }

                    try {
                        let location_source = objRecord.getValue({ fieldId: 'custbody_pe_location_source' });
                        let document_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                        let returnSerie = generateSerie(document_type, location_source);
                        log.debug('returnSerie', returnSerie);
                        objRecord.setValue({ fieldId: 'custbody_pe_serie', value: returnSerie.peserieId, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_number', value: returnSerie.correlative, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_flag_serie', value: returnSerie.serieImpresion, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'tranid', value: 'GR-'+ returnSerie.serieImpresion + '-' + returnSerie.correlative});
                    } catch (error) { }


                } else if (objRecord.type == TRANSFER_ORDER) {
                    try {
                        let location_source = objRecord.getValue({ fieldId: 'location' });
                        let document_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                        let returnSerie = generateSerie(document_type, location_source);
                        objRecord.setValue({ fieldId: 'custbody_pe_serie', value: returnSerie.peserieId, ignoreFieldChange: true });
                        objRecord.setValue({ fieldId: 'custbody_pe_number', value: returnSerie.correlative, ignoreFieldChange: true });
                        //objRecord.setValue({ fieldId: 'tranid', value: 'TO-'+ returnSerie.serieImpresion + '-' + returnSerie.correlative});
                    } catch (error) { }
                } else if (objRecord.type == ITEM_RECEIPT) {
                    let flag_created_from = objRecord.getValue({ fieldId: 'custbody_pe_flag_created_from' });
                    if (flag_created_from == TRANSFER_ORDER) {
                        try {
                            let location_source = objRecord.getValue({ fieldId: 'custbody_pe_location_source' });
                            let document_type = objRecord.getValue({ fieldId: 'custbody_pe_document_type' });
                            let returnSerie = generateSerie(document_type, location_source);
                            objRecord.setValue({ fieldId: 'custbody_pe_serie_cxp', value: returnSerie.serieImpresion, ignoreFieldChange: true });
                            objRecord.setValue({ fieldId: 'custbody_pe_number', value: returnSerie.correlative, ignoreFieldChange: true });
                            //objRecord.setValue({ fieldId: 'tranid', value: 'IR-'+ returnSerie.serieImpresion + '-' + returnSerie.correlative});
                        } catch (error) { }
                    }
                }


            } catch (error) {
                log.error('Error-beforeSubmit-' + objRecord.type, error);
            }
        }
    }


    const generateSerie = (document_type, location) => {
        let ceros;
        try {
            const mySearch = search.create({
                type: 'customrecord_pe_serie',
                filters:
                    [
                        ["isinactive", "is", "F"],
                        'AND',
                        ['custrecord_pe_tipo_documento_serie', 'anyof', document_type],
                        'AND',
                        ['custrecord_pe_location', 'anyof', location]
                    ],
                columns:
                    [
                        'internalid',
                        'custrecord_pe_inicio',
                        'custrecord_pe_serie_impresion'
                    ]
            });

            const searchResult = mySearch.run().getRange({ start: 0, end: 1 });
            let column01 = searchResult[0].getValue(mySearch.columns[0]);
            let column02 = parseInt(searchResult[0].getValue(mySearch.columns[1]));
            let column03 = searchResult[0].getValue(mySearch.columns[2]);

            let next_number = column02 + 1;
            record.submitFields({
                type: 'customrecord_pe_serie',
                id: column01,
                values: {
                    'custrecord_pe_inicio': next_number
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });

            if (next_number.toString().length == 1) {
                ceros = '0000000';
            } else if (next_number.toString().length == 2) {
                ceros = '000000';
            }
            else if (next_number.toString().length == 3) {
                ceros = '00000';
            }
            else if (next_number.toString().length == 4) {
                ceros = '0000';
            }
            else if (next_number.toString().length == 5) {
                ceros = '000';
            }
            else if (next_number.toString().length == 6) {
                ceros = '00';
            }
            else if (next_number.toString().length == 7) {
                ceros = '0';
            } else if (next_number.toString().length >= 8) {
                ceros = '';
            }

            let correlative = ceros + next_number;

            return {
                'peserieId': column01,
                'correlative': correlative,
                'serieImpresion': column03
            }
        }
        catch (e) {
            log.error({ title: 'getCorrelative', details: e });
        }
    }


    const getBinPropio = (location) => {
        const searchObj = search.create({
            type: "bin",
            filters:
                [
                    ["binnumber", "startswith", "I-Propio"],
                    "AND",
                    ["location", "anyof", location]
                ],
            columns:
                [
                    search.createColumn({ name: "internalid", label: "Internal ID" })
                ]
        });
        let searchResultCount = searchObj.runPaged().count;
        if (searchResultCount != 0) {
            const searchResult = searchObj.run().getRange({ start: 0, end: 1 });
            let binPropio = searchResult[0].getValue(searchObj.columns[0]);
            return binPropio;
        } else {
            return 0;
        }
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
        beforeSubmit: beforeSubmit
    }
});
/*********************************************************************************************************************************************
TRACKING
/*********************************************************************************************************************************************
Commit:01
Version: 1.0
Date: 31/03/2022
Author: Dennis Fernández
Description: Creación del script en SB.
==============================================================================================================================================*/