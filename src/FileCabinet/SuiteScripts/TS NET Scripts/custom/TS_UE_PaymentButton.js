/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log'],
    /**
 * @param{log} log
 */
    (log) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            const eventType = scriptContext.type;
            if (eventType === scriptContext.UserEventType.VIEW) {
                const objRecord = scriptContext.newRecord;
                const form = scriptContext.form;
                let account = objRecord.getValue('account').length == 0 ? 0 : objRecord.getValue('account');
                const itf = objRecord.getValue('custbody_il_itf').length == 0 ? 0 : objRecord.getValue('custbody_il_itf');
                const cob = objRecord.getValue('custbody2').length == 0 ? 0 : objRecord.getValue('custbody2');
                const accountITF = objRecord.getValue('custbody3').length == 0 ? 0 : objRecord.getValue('custbody3');
                const accountCOB = objRecord.getValue('custbody4').length == 0 ? 0 : objRecord.getValue('custbody4');
                log.debug('Log', account + ' - ' + itf + ' - ' + accountITF + ' - ' + cob + ' - ' + accountCOB);
                form.clientScriptFileId = 46051; //PR: ? / SB: 46051
                form.addButton({ id: 'custpage_btnITF', label: 'ITF', functionName: 'executeRestlet("ITF", ' + account + ', ' + itf + ', ' + accountITF + ')' });
                form.addButton({ id: 'custpage_btnComisionBancaria', label: 'Comisión Bancaria', functionName: 'executeRestlet("Comisión Bancaria", ' + account + ', ' + cob + ', ' + accountCOB + ')' });
            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return { beforeLoad }

    });
