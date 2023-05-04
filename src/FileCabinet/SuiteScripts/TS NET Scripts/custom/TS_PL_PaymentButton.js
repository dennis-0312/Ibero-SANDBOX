function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    //nlapiLogExecution("DEBUG", "Inicio", 'INICIO-----------------------------');
    var recordType = transactionRecord.getRecordType();
    var accountIL = parseInt(transactionRecord.getFieldValue('custbody_il_cuenta_contable'));

    if (accountIL.length != 0) {
        var account = 111; //2011101 COSTO MERCADERIA IBERO 2011101 - L7

        nlapiLogExecution("DEBUG", recordType, 'INICIO ' + recordType + ' -------------------------------------------------');
        try {
            var countStandard = parseInt(standardLines.getCount());
            for (var i = 0; i < countStandard; i++) {
                if (standardLines.getLine(i).getAccountId() == account) {
                    if (recordType == 'vendorpayment') {
                        var newLine = customLines.addNewLine();
                        newLine.setCreditAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setAccountId(account);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(9);
                        newLine.setClassId(31);
                        newLine.setLocationId(2);

                        var newLine = customLines.addNewLine();
                        newLine.setDebitAmount(standardLines.getLine(i).getDebitAmount());
                        newLine.setAccountId(accountIL);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(9);
                        newLine.setClassId(31);
                        newLine.setLocationId(2);
                    }

                    if (recordType == 'vendorbill') {
                        var newLine = customLines.addNewLine();
                        newLine.setDebitAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(account);
                        newLine.setEntityId(standardLines.getLine(i).getEntityId());
                        newLine.setDepartmentId(standardLines.getLine(i).getDepartmentId());
                        newLine.setClassId(standardLines.getLine(i).getClassId());
                        newLine.setLocationId(standardLines.getLine(i).getLocationId());

                        var newLine = customLines.addNewLine();
                        newLine.setCreditAmount(standardLines.getLine(i).getCreditAmount());
                        newLine.setAccountId(accountIL);
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
}
