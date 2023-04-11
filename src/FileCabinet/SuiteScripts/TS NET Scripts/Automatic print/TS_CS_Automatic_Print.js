/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@NModuleScope Public
 */
define(['N/currentRecord'], (currentRecord) => {

    const pageInit = (context) => {
        const record = currentRecord.get();
        try {
            console.log('pageInit', ' - ' + record.id);
            //record.setValue({ fieldId: 'fieldtest1', value: 'Use this area for any customer comments.' });
            //dialog.alert({ title: 'Announcement', message: 'You are viewing ' + record });
        } catch (e) {
            console.log('Error-pageInit' + ' - ' + e);
        }
    }

    const funcBack = (recordID, recType) => {
        try {
            const record = currentRecord.get();
            //window.location.href = "https://6785603.app.netsuite.com/app/accounting/transactions/cashsale.nl?id=" + recordID + "&whence="
            //window.location.href = "https://6785603-sb1.app.netsuite.com/app/accounting/transactions/cashsale.nl?id=" + recordID;
            window.location.href = "https://6785603-sb1.app.netsuite.com/app/accounting/transactions/" + recType + ".nl?id=" + recordID;
        } catch (e) {
            console.log('Error-setButton' + ' - ' + e);
        }
        //location.reload();
    }

    const funcNew = (recType) => {
        try {
            //window.location.href = "https://6785603.app.netsuite.com/app/accounting/transactions/cashsale.nl";
            //window.location.href = "https://6785603-sb1.app.netsuite.com/app/accounting/transactions/cashsale.nl";
            window.location.href = "https://6785603-sb1.app.netsuite.com/app/accounting/transactions/" + recType + ".nl";
        } catch (e) {
            console.log('Error-setButton' + ' - ' + e);
        }
        //location.reload();
    }



    return {
        pageInit: pageInit,
        funcBack: funcBack,
        funcNew: funcNew
    }
});
