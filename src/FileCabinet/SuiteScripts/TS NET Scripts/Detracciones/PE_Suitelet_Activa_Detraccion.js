/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/redirect', 'N/task', 'N/log', 'N/file', 'N/encode'],
    function(ui, email, runtime, search, redirect, task, log, file, encode) {
        function onRequest(context){
			
			log.debug('Inicio','Inicio');
			
			if (context.request.method === 'GET') {
				var filterPagePOST = context.request.parameters.journalId;
				var form = ui.createForm({
					title: 'Activación de Proceso Detracción'
				});
				log.debug('filterPagePOST',filterPagePOST);
              var myFilter = search.createFilter({
				name: 'scriptid',
				operator: search.Operator.IS,
				values: 'customdeploy_pe_schedule_detracc_interno'
			});
			var mySearchScript = search.create({
				type: search.Type.SCRIPT_DEPLOYMENT,
					columns: ['script'],
					filters: myFilter
				});
			var idScript = ''
			mySearchScript.run().each(function(result) {
				idScript = result.getValue({
					name: 'script'
				});
              
				return true;
			});
			log.debug('SCRIPT', idScript);
				var scriptTask = task.create({
					taskType: task.TaskType.SCHEDULED_SCRIPT,
					scriptId: idScript,
					deploymentId: 'customdeploy_pe_schedule_detracc_interno',
					params: {custscript_pe_journal_id: filterPagePOST}
				});
				var scriptTaskId = scriptTask.submit();
				context.response.writePage(form);
            }else{
				var filterPagePOST = context.request.parameters.journalId;
            }
        }
        return {
            onRequest: onRequest
        };
    });