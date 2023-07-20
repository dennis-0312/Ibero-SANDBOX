function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    //nlapiLogExecution("DEBUG", "Inicio", 'INICIO-----------------------------');
    var accountToCredit = 2975; //691210 COSTO MERCADERIA IBERO 691210 - L6
    var accountToDebit = 671; //2011101 COSTO MERCADERIA IBERO 2011101 - L7
    var accountMatchConsig = 3450; //063101 Mercaderia en Consignación SB: 3451 - PR:3450
    var accountMatchConsigForSale = 3451; //041101 Mercaderías en Consignación SB: 3452 - PR:3451
    var recordType = transactionRecord.getRecordType();
    var esconsignacion = transactionRecord.getFieldValue('custbody_pe_es_consignacion');
    var typeCreatedFrom = transactionRecord.getFieldValue('custbody_pe_flag_created_from');

    // var record = nlapiLoadRecord('customrecord_pe_ei_enable_features', 1);
    // var ruc = record.getFieldValue('custrecord_pe_ei_ruc');
    // nlapiLogExecution("DEBUG", "TestOpenRecord", ruc);
    //nlapiLogExecution("DEBUG", "TypeCreatedFrom", typeCreatedFrom);
    // if (typeCreatedFrom == 'salesorder') {
    //     accountToCredit = 2975; //691210 COSTO MERCADERIA IBERO 691210 - L6
    //     accountToDebit = 671; //2011101 COSTO MERCADERIA IBERO 2011101 - L7
    //     accountMatchConsig = 3451; //063101 Mercaderia en Consignación
    // } else 
    if (typeCreatedFrom == 'transferorder') {
        accountToInvTran = 216; //Inventario en tránsito
        accountToCredit = 2975; //691210 COSTO MERCADERIA IBERO 691210 - L6
        accountToDebit = 671; //2011101 COSTO MERCADERIA IBERO 2011101 - L7
        accountMatchConsig = 3451; //063101 Mercaderia en Consignación SB: 3451 - PR:3450
    }

    if (recordType == 'itemreceipt') {
        nlapiLogExecution("DEBUG", "Consignación", 'INICIO Item Receipt -------------------------------------------------');
        try {
            if (typeCreatedFrom == 'purchaseorder' && esconsignacion == 'T') {
                var countStandard = parseInt(standardLines.getCount());
                for (var i = 1; i < countStandard; i++) {
                    var sku = transactionRecord.getLineItemText('item', 'item', i);
                    var newLine = customLines.addNewLine();
                    newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(accountMatchConsig);
                    newLine.setMemo(sku);
                    var newLine = customLines.addNewLine();
                    newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(standardLines.getLine(i).getAccountId());
                    newLine.setMemo(sku);
                    nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                }
            } else if (typeCreatedFrom == 'transferorder') {
                nlapiLogExecution("DEBUG", "transferorder", 'Item Receipt');
                var countStandard = parseInt(standardLines.getCount());
                var countTransaction = transactionRecord.getLineItemCount('item');
                var j = 1
                for (var i = 1; i < countStandard; i++) {
                    if (j > countTransaction) {
                        break;
                    }
                    var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                    var averageCost = transactionRecord.getLineItemValue('item', 'custcol_pe_average_cost', j);
                    var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                    var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                    var sku = transactionRecord.getLineItemText('item', 'item', j);
                    var account = standardLines.getLine(i).getAccountId();
                    if (account == accountToDebit) {
                        if (isConsig == 'T') {
                            var newLine = customLines.addNewLine();
                            //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setAccountId(accountToDebit); //214 //2974
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                        }
                    } else if (account == accountToInvTran) {
                        if (isConsig == 'T') {
                            var newLine = customLines.addNewLine();
                            // newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                            newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                            newLine.setAccountId(accountMatchConsig);
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                            j++;
                            nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        } else {
                            j++;
                        }
                    }
                }
            } else if (typeCreatedFrom == 'returnauthorization') {
                var countStandard = parseInt(standardLines.getCount());
                var countTransaction = transactionRecord.getLineItemCount('item');
                var j = 1
                for (var i = 1; i < countStandard; i++) {
                    if (j > countTransaction) {
                        break;
                    }
                    var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                    var sku = transactionRecord.getLineItemText('item', 'item', j);
                    var account = standardLines.getLine(i).getAccountId();
                    if (account == accountToDebit) {
                        if (isConsig == 'T') {
                            var newLine = customLines.addNewLine();
                            //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setAccountId(accountMatchConsig); //214 //2974
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                            var newLine = customLines.addNewLine();
                            newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setAccountId(standardLines.getLine(i).getAccountId());
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                            j++;
                            nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        }
                    }
                }
            }
        } catch (error) {
            nlapiLogExecution('ERROR', 'ItemReceipt', error);
        }
        nlapiLogExecution("DEBUG", "Consignación", 'FINISH Item Receipt -------------------------------------------------');
    } else if (recordType == 'itemfulfillment') {
        nlapiLogExecution("DEBUG", "Consignación", 'INICIO Item Fulfillment -------------------------------------------------');
        try {
            if (typeCreatedFrom == 'salesorder') {
                if (esconsignacion == 'T') {
                    accountMatchConsig = accountMatchConsigForSale
                }
                var countStandard = parseInt(standardLines.getCount());
                var countTransaction = transactionRecord.getLineItemCount('item');
                var j = 1
                for (var i = 1; i < countStandard; i++) {
                    if (j > countTransaction) {
                        break;
                    }
                    var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                    var averageCost = transactionRecord.getLineItemValue('item', 'custcol_pe_average_cost', j);
                    var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                    var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                    var sku = transactionRecord.getLineItemText('item', 'item', j);
                    var account = standardLines.getLine(i).getAccountId();
                    //nlapiLogExecution('DEBUG', 'ItemFulfillment', 'Cuenta0: ' + account + ' -I: ' + i + ' -J: ' + j);
                    if (account == accountToCredit) {
                        //nlapiLogExecution('DEBUG', 'ItemFulfillment', 'Cuenta1: ' + account + ' -I: ' + i + ' -J: ' + j);
                        if (isConsig == 'T' || esconsignacion == 'T') {
                            var newLine = customLines.addNewLine();
                            //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setCreditAmount(amountConsig);
                            newLine.setAccountId(accountMatchConsig); //214 //2974
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                        }
                    } else if (account == accountToDebit) {
                        //nlapiLogExecution('DEBUG', 'ItemFulfillment', 'Cuenta2: ' + account + ' -I: ' + i + ' -J: ' + j);
                        if (isConsig == 'T' || esconsignacion == 'T') {
                            var newLine = customLines.addNewLine();
                            // newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                            newLine.setDebitAmount(amountConsig);
                            newLine.setAccountId(accountToDebit);
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                            j++;
                            nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        } else {
                            j++;
                        }
                    }
                }
            } else if (typeCreatedFrom == 'vendorreturnauthorization' && esconsignacion == 'T') {
                var countStandard = parseInt(standardLines.getCount());
                nlapiLogExecution("DEBUG", "LINES", countStandard);
                var sku = '';
                var entity = '';
                var department = '';
                var clase = '';
                var location = '';
                for (var i = 1; i < countStandard; i++) {
                    if (transactionRecord.getLineItemText('item', 'item', i) != null) {
                        sku = transactionRecord.getLineItemText('item', 'item', i);
                        entity = standardLines.getLine(i).getEntityId();
                        department = standardLines.getLine(i).getDepartmentId();
                        clase = standardLines.getLine(i).getClassId();
                        location = standardLines.getLine(i).getLocationId();
                    }
                    if (standardLines.getLine(i).getCreditAmount() != 0) {
                        var newLine = customLines.addNewLine();
                        newLine.setCreditAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(accountMatchConsig);
                        newLine.setEntityId(entity);
                        newLine.setDepartmentId(department);
                        newLine.setClassId(clase);
                        newLine.setLocationId(location);
                        newLine.setMemo(sku);

                        var newLine = customLines.addNewLine();
                        newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(standardLines.getLine(i).getAccountId());
                        newLine.setEntityId(entity);
                        newLine.setDepartmentId(department);
                        newLine.setClassId(clase);
                        newLine.setLocationId(location);
                        newLine.setMemo(sku);

                        nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        // nlapiLogExecution("DEBUG", "DEBIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getDebitAmount());
                        nlapiLogExecution("DEBUG", "CREDIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getCreditAmount());
                    }
                    // nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                    // nlapiLogExecution("DEBUG", "DEBIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getDebitAmount());
                    // nlapiLogExecution("DEBUG", "CREDIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getCreditAmount());

                }
            } else if (typeCreatedFrom == 'transferorder') {
                // var countStandard = parseInt(standardLines.getCount());
                // nlapiLogExecution("DEBUG", "LINES", countStandard);
                // var sku = '';
                // var entity = '';
                // var department = '';
                // var clase = '';
                // var location = '';
                // for (var i = 1; i < countStandard; i++) {
                //     var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                //     var averageCost = transactionRecord.getLineItemValue('item', 'custcol_pe_average_cost', j);
                //     var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                //     var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                //     if (transactionRecord.getLineItemText('item', 'item', i) != null) {
                //         sku = transactionRecord.getLineItemText('item', 'item', i);
                //         entity = standardLines.getLine(i).getEntityId();
                //         department = standardLines.getLine(i).getDepartmentId();
                //         clase = standardLines.getLine(i).getClassId();
                //         location = standardLines.getLine(i).getLocationId();
                //     }
                //     if (standardLines.getLine(i).getCreditAmount() != 0) {
                //         var newLine = customLines.addNewLine();
                //         newLine.setCreditAmount(standardLines.getLine(i).getCreditAmount());
                //         newLine.setAccountId(122);
                //         newLine.setEntityId(entity);
                //         newLine.setDepartmentId(department);
                //         newLine.setClassId(clase);
                //         newLine.setLocationId(location);
                //         newLine.setMemo(sku);

                //         var newLine = customLines.addNewLine();
                //         newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                //         newLine.setAccountId(standardLines.getLine(i).getAccountId());
                //         newLine.setEntityId(entity);
                //         newLine.setDepartmentId(department);
                //         newLine.setClassId(clase);
                //         newLine.setLocationId(location);
                //         newLine.setMemo(sku);

                //         nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                //         // nlapiLogExecution("DEBUG", "DEBIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getDebitAmount());
                //         nlapiLogExecution("DEBUG", "CREDIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getCreditAmount());
                //     }
                //     // nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                //     // nlapiLogExecution("DEBUG", "DEBIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getDebitAmount());
                //     // nlapiLogExecution("DEBUG", "CREDIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getCreditAmount());
                // }

                var countStandard = parseInt(standardLines.getCount());
                var countTransaction = transactionRecord.getLineItemCount('item');
                var j = 1
                for (var i = 1; i < countStandard; i++) {
                    if (j > countTransaction) {
                        break;
                    }
                    var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                    var averageCost = transactionRecord.getLineItemValue('item', 'custcol_pe_average_cost', j);
                    var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                    var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                    var sku = transactionRecord.getLineItemText('item', 'item', j);
                    var account = standardLines.getLine(i).getAccountId();
                    if (account == accountToInvTran) {
                        if (isConsig == 'T') {
                            var newLine = customLines.addNewLine();
                            //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                            newLine.setCreditAmount(amountConsig);
                            newLine.setAccountId(accountMatchConsig); //214 //2974
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                        }
                    } else if (account == accountToDebit) {
                        if (isConsig == 'T') {
                            var newLine = customLines.addNewLine();
                            // newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                            newLine.setDebitAmount(amountConsig);
                            newLine.setAccountId(accountToDebit);
                            newLine.setEntityId(standardLines.getLine(i).getEntityId());
                            newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                            newLine.setClassId(standardLines.getLine(i).getClassId());
                            newLine.setLocationId(standardLines.getLine(i).getLocationId());
                            newLine.setMemo(sku);
                            j++;
                            nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        } else {
                            j++;
                        }
                    }
                }
            }
        } catch (error) {
            nlapiLogExecution('ERROR', 'ItemFulfillment', error);
        }
        nlapiLogExecution("DEBUG", "Consignación", 'FIN Item Fulfillment -------------------------------------------------');
    } else if (recordType == 'cashsale') {
        nlapiLogExecution("DEBUG", "Consignación", 'INICIO Cash Sale -------------------------------------------------');
        try {
            var countStandard = parseInt(standardLines.getCount());
            var countTransaction = transactionRecord.getLineItemCount('item');
            var j = 1
            for (var i = 1; i < countStandard; i++) {
                if (j > countTransaction) {
                    break;
                }
                //var invDetailOnLine = transactionRecord.viewLineItemSubrecord('item', 'inventorydetail', j);
                var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
                var averageCost = transactionRecord.getLineItemValue('item', 'averagecost', j);
                var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                var sku = transactionRecord.getLineItemText('item', 'item', j);
                var account = standardLines.getLine(i).getAccountId();
                if (account == accountToCredit) { //ArtCondig : 2974 - OtherArt: 2975
                    if (isConsig == 'T') {
                        nlapiLogExecution("DEBUG", "SKU", sku);
                        var newLine = customLines.addNewLine();
                        //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setCreditAmount(amountConsig);
                        newLine.setAccountId(accountMatchConsig); //214 //2974
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                        newLine.setClassId(standardLines.getLine(i).getClassId());
                        newLine.setLocationId(standardLines.getLine(i).getLocationId());
                        newLine.setMemo(sku);
                        // nlapiLogExecution("DEBUG", "ROWS", account + ' - ' + standardLines.getLine(i).getDebitAmount() + ' - ' + standardLines.getLine(i).getCreditAmount());
                    }
                } else if (account == accountToDebit) { //ArtCondig : 669 - OtherArt: 671
                    if (isConsig == 'T') {
                        var newLine = customLines.addNewLine();
                        //newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setDebitAmount(amountConsig);
                        newLine.setAccountId(accountToDebit);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                        newLine.setClassId(standardLines.getLine(i).getClassId());
                        newLine.setLocationId(standardLines.getLine(i).getLocationId());
                        newLine.setMemo(sku);
                        j++;
                        nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                        // nlapiLogExecution("DEBUG", "SUCCESS", 'Es consig Line -' + sku);
                    } else {
                        j++;
                        // nlapiLogExecution("DEBUG", "FAIL", 'No es consig Line -' + j);
                    }
                }
                // var account = standardLines.getLine(i).getAccountId();
                // var debit = standardLines.getLine(i).getDebitAmount();
                // var credit = standardLines.getLine(i).getCreditAmount();
                // nlapiLogExecution("DEBUG", "ROWS", account + ' - ' + debit + ' - ' + credit);
            }
        } catch (error) {
            nlapiLogExecution('ERROR', 'Cash Sale', error);
        }
        nlapiLogExecution("DEBUG", "Consignación", 'FIN Cash Sale -----------------------------------------------------');
    } else if (recordType == 'invoice') {
        nlapiLogExecution("DEBUG", "Consignación", 'INICIO Invoice -------------------------------------------------');
        try {
            var countStandard = parseInt(standardLines.getCount());
            var countTransaction = transactionRecord.getLineItemCount('item');
            //var j = 0
            nlapiLogExecution("DEBUG", "countStandard", countStandard);
            nlapiLogExecution("DEBUG", "countTransaction", countTransaction);
            for (var j = 1; j <= countTransaction; j++) {
                // if (j > countTransaction) {
                //     break;
                // }
                var averageCost = transactionRecord.getLineItemValue('item', 'averagecost', j);
                var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                var type = transactionRecord.getLineItemValue('item', 'itemtype', j);
                nlapiLogExecution("DEBUG", "type", type);
                var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                var sku = transactionRecord.getLineItemText('item', 'item', j);
                nlapiLogExecution("DEBUG", "SKU", sku);
                //var account = standardLines.getLine(1).getAccountId();

                if (esconsignacion == 'T' && type == 'InvtPart') {
                    // nlapiLogExecution("DEBUG", "SKU", sku);
                    var newLine = customLines.addNewLine();
                    //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setCreditAmount(amountConsig);
                    newLine.setAccountId(accountToDebit); //214 //2974
                    newLine.setEntityId(standardLines.getLine(1).getEntityId());
                    newLine.setDepartmentId(standardLines.getLine(1).getDepartmentId());
                    newLine.setClassId(standardLines.getLine(1).getClassId());
                    newLine.setLocationId(standardLines.getLine(1).getLocationId());
                    newLine.setMemo(sku);
                    // nlapiLogExecution("DEBUG", "ROWS", account + ' - ' + standardLines.getLine(i).getDebitAmount() + ' - ' + standardLines.getLine(i).getCreditAmount());

                    var newLine = customLines.addNewLine();
                    //newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                    newLine.setDebitAmount(amountConsig);
                    newLine.setAccountId(accountMatchConsigForSale);
                    newLine.setEntityId(standardLines.getLine(1).getEntityId());
                    newLine.setDepartmentId(standardLines.getLine(1).getDepartmentId());
                    newLine.setClassId(standardLines.getLine(1).getClassId());
                    newLine.setLocationId(standardLines.getLine(1).getLocationId());
                    newLine.setMemo(sku);
                    nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                    // nlapiLogExecution("DEBUG", "SUCCESS", 'Es consig Line -' + sku);
                }
                // else {
                //     j++;
                //     // nlapiLogExecution("DEBUG", "FAIL", 'No es consig Line -' + j);
                // }

            }
        } catch (error) {
            nlapiLogExecution('ERROR', 'Invoice', error);
        }
        nlapiLogExecution("DEBUG", "Consignación", 'FIN Invoice -----------------------------------------------------');
    } else if (recordType == 'inventoryadjustment') {
        nlapiLogExecution("DEBUG", "Consignación", 'INICIO Inventory Adjustment -------------------------------------------------');
        try {
            var countStandard = parseInt(standardLines.getCount());
            var countTransaction = transactionRecord.getLineItemCount('inventory');
            var j = 1
            // nlapiLogExecution("DEBUG", "countStandard", countStandard);
            // nlapiLogExecution("DEBUG", "countTransaction", countTransaction);
            for (var i = 1; i < countStandard; i++) {
                // nlapiLogExecution("DEBUG", "DEBIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getDebitAmount());
                // nlapiLogExecution("DEBUG", "CREDIT", 'line: ' + i + ' - amount: ' + standardLines.getLine(i).getCreditAmount());
                // nlapiLogExecution("DEBUG", "SKU", 'line: ' + j + ' - sku: ' + transactionRecord.getLineItemText('inventory', 'item', j));
                // j++
                // if (j > countTransaction) {
                //     break;
                // }
                // var averageCost = transactionRecord.getLineItemValue('item', 'averagecost', j);
                // var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
                // var type = transactionRecord.getLineItemValue('item', 'itemtype', j);
                // nlapiLogExecution("DEBUG", "type", type);
                // var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
                var sku = transactionRecord.getLineItemText('inventory', 'item', j);
                // nlapiLogExecution("DEBUG", "SKU", sku);
                //var account = standardLines.getLine(1).getAccountId();

                if (esconsignacion == 'T') {
                    // nlapiLogExecution("DEBUG", "SKU-", sku);
                    var newLine = customLines.addNewLine();
                    //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(accountToDebit); //214 //2974
                    newLine.setEntityId(standardLines.getLine(i).getEntityId());
                    newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                    newLine.setClassId(standardLines.getLine(i).getClassId());
                    newLine.setLocationId(standardLines.getLine(i).getLocationId());
                    newLine.setMemo(sku);
                    // nlapiLogExecution("DEBUG", "ROWS", account + ' - ' + standardLines.getLine(i).getDebitAmount() + ' - ' + standardLines.getLine(i).getCreditAmount());

                    var newLine = customLines.addNewLine();
                    //newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                    newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(accountMatchConsig);
                    newLine.setEntityId(standardLines.getLine(i).getEntityId());
                    newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                    newLine.setClassId(standardLines.getLine(i).getClassId());
                    newLine.setLocationId(standardLines.getLine(i).getLocationId());
                    newLine.setMemo(sku);
                    nlapiLogExecution("DEBUG", "ITEM", sku + ' - is consig');
                    // nlapiLogExecution("DEBUG", "SUCCESS", 'Es consig Line -' + sku);
                    j++;
                }
                // else {
                //     j++;
                //     // nlapiLogExecution("DEBUG", "FAIL", 'No es consig Line -' + j);
                // }

            }
        } catch (error) {
            nlapiLogExecution('ERROR', 'Inventory Adjustment', error);
        }
        nlapiLogExecution("DEBUG", "Consignación", 'FIN Inventory Adjustment -----------------------------------------------------');
    }
}