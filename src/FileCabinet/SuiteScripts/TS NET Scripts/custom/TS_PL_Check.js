function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    //nlapiLogExecution("DEBUG", "Inicio", 'INICIO-----------------------------');
    var recordType = transactionRecord.getRecordType();
    //var accountIL = parseInt(transactionRecord.getFieldValue('custbody_il_cuenta_contable'));
    var account10 = 5492; //SB:4705 - PR:5492 -- 1041119 Banco Asiento de Apertura
    var account14OpeningBalance = 53; //SB:53 - PR:53 --- 3200 Opening Balance	
    var account14 = 4183 //SB:4183 - PR:4183 -- 1413103 Entrega a rendir 1413103-L7
    var existAccount10 = 0
    nlapiLogExecution("DEBUG", recordType, 'INICIO ' + recordType + ' -------------------------------------------------');
    try {
        var countStandard = parseInt(standardLines.getCount());
        j = 1
        for (var i = 0; i < countStandard; i++) {
            //nlapiLogExecution('DEBUG', recordType, i + ' - ' + standardLines.getLine(i).getAccountId());
            if (standardLines.getLine(i).getAccountId() == account10) {
                existAccount10 = 1
            }
        }

        if (existAccount10 == 1) {
            for (var i = 0; i < countStandard; i++) {
                if (standardLines.getLine(i).getAccountId() == account14) {

                    var newLine = customLines.addNewLine();
                    newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(account14OpeningBalance);
                    newLine.setEntityId(standardLines.getLine(i).getEntityId());
                    newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                    newLine.setClassId(standardLines.getLine(i).getClassId());
                    newLine.setLocationId(standardLines.getLine(i).getLocationId());

                    var newLine = customLines.addNewLine();
                    newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                    newLine.setAccountId(account10);
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
    // }
}

// if (standardLines.getLine(i).getAccountId() == account) {
            //     if (recordType == 'vendorpayment') {
            //         var newLine = customLines.addNewLine();
            //         newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
            //         newLine.setAccountId(account);
            //         newLine.setEntityId(standardLines.getLine(i).getEntityId());
            //         newLine.setDepartmentId(9);
            //         newLine.setClassId(31);
            //         newLine.setLocationId(2);

            //         var newLine = customLines.addNewLine();
            //         newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
            //         newLine.setAccountId(accountIL);
            //         newLine.setEntityId(standardLines.getLine(i).getEntityId());
            //         newLine.setDepartmentId(9);
            //         newLine.setClassId(31);
            //         newLine.setLocationId(2);
            //     }

            //     if (recordType == 'vendorbill') {
            //         var newLine = customLines.addNewLine();
            //         newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
            //         newLine.setAccountId(account);
            //         newLine.setEntityId(standardLines.getLine(i).getEntityId());
            //         newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
            //         newLine.setClassId(standardLines.getLine(i).getClassId());
            //         newLine.setLocationId(standardLines.getLine(i).getLocationId());

            //         var newLine = customLines.addNewLine();
            //         newLine.setCreditAmount(standardLines.getLine(i).getCreditAmount());
            //         newLine.setAccountId(accountIL);
            //         newLine.setEntityId(standardLines.getLine(i).getEntityId());
            //         newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
            //         newLine.setClassId(standardLines.getLine(i).getClassId());
            //         newLine.setLocationId(standardLines.getLine(i).getLocationId());
            //     }
            // }
