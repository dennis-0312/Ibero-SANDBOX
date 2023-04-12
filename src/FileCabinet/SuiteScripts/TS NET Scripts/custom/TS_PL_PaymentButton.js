function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    //nlapiLogExecution("DEBUG", "Inicio", 'INICIO-----------------------------');
    var recordType = transactionRecord.getRecordType();
    var accountIL = parseInt(transactionRecord.getFieldValue('custbody_il_cuenta_contable'));

    if (accountIL.length != 0) {
        //nlapiLogExecution("DEBUG", "TypeCreatedFrom", recordType);
        //nlapiLogExecution("DEBUG", "accountIL", accountIL);
        var account = 111; //2011101 COSTO MERCADERIA IBERO 2011101 - L7

        nlapiLogExecution("DEBUG", recordType, 'INICIO ' + recordType + ' -------------------------------------------------');
        try {
            var countStandard = parseInt(standardLines.getCount());
            //var countTransaction = transactionRecord.getLineItemCount('item');
            for (var i = 0; i < countStandard; i++) {
                //nlapiLogExecution("DEBUG", "Consignación", standardLines.getLine(i).getAccountId() + ' - ' + i);
                if (standardLines.getLine(i).getAccountId() == account) {
                    //nlapiLogExecution("DEBUG", "Account", standardLines.getLine(i).getAccountId() + ' - ' + i);
                    // nlapiLogExecution("DEBUG", "accountIL", typeof accountIL);


                    if (recordType == 'vendorpayment') {
                        var newLine = customLines.addNewLine();
                        newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setAccountId(accountIL);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(9);
                        newLine.setClassId(31);
                        newLine.setLocationId(2);
                        // newLine.setMemo(sku);

                        var newLine = customLines.addNewLine();
                        //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setAccountId(accountIL); //214 //2974
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(9);
                        newLine.setClassId(31);
                        newLine.setLocationId(2);
                    }



                    if (recordType == 'vendorbill') {
                        var newLine = customLines.addNewLine();
                        newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(accountIL);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                        newLine.setClassId(standardLines.getLine(i).getClassId());
                        newLine.setLocationId(standardLines.getLine(i).getLocationId());


                        var newLine = customLines.addNewLine();
                        //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setCreditAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(accountIL); //214 //2974
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                        newLine.setClassId(standardLines.getLine(i).getClassId());
                        newLine.setLocationId(standardLines.getLine(i).getLocationId());
                    }
                }
            }
        } catch (error) {
            nlapiLogExecution('ERROR', recordType, error);
        }
        nlapiLogExecution("DEBUG", recordType, 'FINISH ' + recordType + ' -------------------------------------------------');
    }


    // if (accountIL.length != 0) {
    //     nlapiLogExecution("DEBUG", "TypeCreatedFrom", recordType);
    //     accountToDebit = 111; //2011101 COSTO MERCADERIA IBERO 2011101 - L7

    //     nlapiLogExecution("DEBUG", "Consignación", 'INICIO Item Receipt -------------------------------------------------');
    //     try {
    //         nlapiLogExecution("DEBUG", "transferorder", 'Item Receipt');
    //         var countStandard = parseInt(standardLines.getCount());
    //         var countTransaction = transactionRecord.getLineItemCount('item');
    //         var j = 1
    //         for (var i = 1; i < countStandard; i++) {
    //             if (j > countTransaction) {
    //                 break;
    //             }
    //             var isConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_aplicar_consignacion', j);
    //             var averageCost = transactionRecord.getLineItemValue('item', 'custcol_pe_average_cost', j);
    //             var quantityConsig = transactionRecord.getLineItemValue('item', 'custcol_pe_cantidad_consignada', j);
    //             var amountConsig = parseFloat(averageCost) * parseInt(quantityConsig);
    //             var sku = transactionRecord.getLineItemText('item', 'item', j);
    //             var account = standardLines.getLine(i).getAccountId();
    //             if (account == accountToDebit) {
    //                 var newLine = customLines.addNewLine();
    //                 //newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
    //                 newLine.setCreditAmount(amountConsig);
    //                 newLine.setAccountId(accountMatchConsig); //214 //2974
    //                 newLine.setEntityId(standardLines.getLine(i).getEntityId());
    //                 newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
    //                 newLine.setClassId(standardLines.getLine(i).getClassId());
    //                 newLine.setLocationId(standardLines.getLine(i).getLocationId());
    //                 newLine.setMemo(sku);

    //                 var newLine = customLines.addNewLine();
    //                 // newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
    //                 newLine.setDebitAmount(amountConsig);
    //                 newLine.setAccountId(accountToDebit);
    //                 newLine.setEntityId(standardLines.getLine(i).getEntityId());
    //                 newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
    //                 newLine.setClassId(standardLines.getLine(i).getClassId());
    //                 newLine.setLocationId(standardLines.getLine(i).getLocationId());
    //                 newLine.setMemo(sku);
    //             }




    //         }

    //     } catch (error) {
    //         nlapiLogExecution('ERROR', 'ItemReceipt', error);
    //     }
    //     nlapiLogExecution("DEBUG", "Consignación", 'FINISH Item Receipt -------------------------------------------------');
    // }



}
