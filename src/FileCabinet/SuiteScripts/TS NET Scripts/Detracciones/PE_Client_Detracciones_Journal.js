/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/error', 'N/currentRecord', 'N/search', 'N/log', 'N/runtime'],
	function (error, currentRecord, search, log, runtime) {
		function fieldChanged(context) {
			var fieldNameD = context.fieldId;
		}


		function iniciaProcesoDetraccion(journalId) {

			log.debug('PE_Client_Detracciones_Journal', 'PE_Client_Detracciones_Journal');

			var rec = currentRecord.get();
			// var actValue = rec.getValue({
			// 	fieldId: 'id'
			// });
			var actValue = journalId;
			console.debug('JournalId: ' + journalId)
			var myFilter = search.createFilter({
				name: 'scriptid',
				operator: search.Operator.IS,
				values: 'customdeploy_pe_suitelet_activa_detracc'
			});
			var mySearchScript = search.create({
				type: search.Type.SCRIPT_DEPLOYMENT,
				columns: ['script'],
				filters: myFilter
			});
			var idScript = ''
			mySearchScript.run().each(function (result) {
				idScript = result.getValue({
					name: 'script'
				});
				return true;
			});
			var scriptObj = runtime.getCurrentScript();
			var urlDeploy = scriptObj.getParameter({ name: 'custscript_pe_url_deployments' });
			var finalUrl = urlDeploy + "/app/site/hosting/scriptlet.nl?script=" + idScript + "&deploy=1";
			//var finalUrl  = "https://5091977.app.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1";
			var windowOpen = window.open(finalUrl + '&journalId=' + actValue, 'Suitelet Inicia Schedule', 'location=1,status=1,scrollbars=1, width=100,height=100');
			setTimeout(function () { windowOpen.close(); }, 2000);
		}


		function printRetentionReceipt() {

			var rec = currentRecord.get();
			var actValue = rec.getValue({
				fieldId: 'id'
			});
			var myFilter = search.createFilter({
				name: 'scriptid',
				operator: search.Operator.IS,
				values: 'customdeploy_pe_suitelet_print_retention'
			});
			var mySearchScript = search.create({
				type: search.Type.SCRIPT_DEPLOYMENT,
				columns: ['script'],
				filters: myFilter
			});
			var idScript = ''
			mySearchScript.run().each(function (result) {
				idScript = result.getValue({
					name: 'script'
				});
				return true;
			});
			var scriptObj = runtime.getCurrentScript();
			var urlDeploy = scriptObj.getParameter({ name: 'custscript_pe_url_deployments' });
			var finalUrl = urlDeploy + "/app/site/hosting/scriptlet.nl?script=" + idScript + "&deploy=1";
			//var finalUrl  = "https://5091977.app.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1";
			var windowOpen = window.open(finalUrl + '&journalId=' + actValue, 'Suitelet Inicia Schedule', 'location=1,status=1,scrollbars=1');
			//setTimeout(function () { windowOpen.close();}, 2000);
		}
		return {
			fieldChanged: fieldChanged,
			iniciaProcesoDetraccion: iniciaProcesoDetraccion,
			printRetentionReceipt: printRetentionReceipt
		};
	}
);