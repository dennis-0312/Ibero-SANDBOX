/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/ui/serverWidget', 'N/task'],
	function (record, log, serverWidget, task) {
		function beforeLoadDetraccion(context) {
			var formContext = context.form;
			var newRecord = context.newRecord;
			var journalId = newRecord.id;
			var notesField = formContext.getField({ id: 'custbody_pe_detraccion' });
			if (notesField.defaultValue == 'T') {
				formContext.addButton({
					id: 'custpage_btnProcesaDetr',
					label: 'Procesa Detracción',
					functionName: 'iniciaProcesoDetraccion(' + journalId + ')'
				});
				formContext.clientScriptModulePath = './PE_Client_Detracciones_Journal.js';
			}
		}
		return {
			beforeLoad: beforeLoadDetraccion
		};
	});