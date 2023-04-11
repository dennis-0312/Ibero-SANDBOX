/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/log', 'N/record'], (log, record) => {

    function beforeLoad(context) {

    }

    const beforeSubmit = (context) => {
        const newRecord = context.newRecord;
        try {
            log.debug('Init', 'Init');
            let jsonLines = JSON.parse(newRecord.getValue('custbody_pe_flag_lines_csg'));
            log.debug('Debug1', typeof (jsonLines) + ' - ' + jsonLines);

            for (let i in jsonLines) {
                let invDetailRec = newRecord.getSublistSubrecord({ sublistId: 'item', fieldId: 'inventorydetail', line: parseInt(jsonLines[i].line) });
                log.debug('Debug2', invDetailRec);
                invDetailRec.setSublistValue({ sublistId: 'inventoryassignment', fieldId: 'binnumber', line: 0, value: 1 });
            }
        } catch (error) {
            log.error('Error', error);
        }
    }

    function afterSubmit(context) {

    }

    return {
        //beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});
