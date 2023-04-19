/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            log.debug('Context', requestParams);

            try {
                // if (requestParams.taskAction == 'itf') {
                const objRecord = record.create({ type: record.Type.JOURNAL_ENTRY, isDynamic: true });
                objRecord.setValue({ fieldId: 'trandate', value: new Date() });
                objRecord.setValue({ fieldId: 'memo', value: requestParams.taskAction });
                objRecord.setValue({ fieldId: 'subsidiary', value: 1 });

                objRecord.selectNewLine({ sublistId: 'line' });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: requestParams.account, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'credit', value: parseFloat(requestParams.amount), ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'department', value: 9, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'class', value: 31, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'location', value: 2, ignoreFieldChange: false });
                objRecord.commitLine({ sublistId: 'line' });

                objRecord.selectNewLine({ sublistId: 'line' });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: requestParams.account2, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'debit', value: parseFloat(requestParams.amount), ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'department', value: 9, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'class', value: 31, ignoreFieldChange: false });
                objRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'location', value: 2, ignoreFieldChange: false });
                objRecord.commitLine({ sublistId: 'line' });

                objResults = objRecord.save({ ignoreMandatoryFields: true });
                log.debug('Journal', objResults);
                // }
                return 'Asiento Diario ' + objResults + ' creado';
            } catch (error) {
                return error.message;
            }

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return { get }

    });
