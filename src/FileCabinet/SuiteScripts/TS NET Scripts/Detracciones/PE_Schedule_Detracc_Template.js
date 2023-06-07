/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime', 'N/log', 'N/file', 'N/task', 'N/format', "N/config"],
    function(search, record, email, runtime, log, file, task, format, config) {
        function execute(context) {
        	var featureSubsidiary = runtime.isFeatureInEffect({
                feature: "SUBSIDIARIES"
            });

            var configpage = config.load({
                type: config.Type.COMPANY_INFORMATION
            });

            var searchId = 'customsearch_pe_detrac_pagar';
            var scriptObj = runtime.getCurrentScript();
            var filterPostingPeriod = scriptObj.getParameter({
                name: 'custscript_pe_period_bnacion_journal'
            }); //112;
            var filterSubsidiary = scriptObj.getParameter({
                name: 'custscript_pe_subsidiary_journal'
            }); //2;
            var filterAccountBank = scriptObj.getParameter({
                name: 'custscript_pe_account_bank_journal'
            });

            var fedIdNumb;

            var recordAccount;

            var companyname;

            var detraccionAccountId;
            var detraccionAccountName;

            if(featureSubsidiary || featureSubsidiary == 'T'){
            	var subLookup = search.lookupFields({
	                type: search.Type.SUBSIDIARY,
	                id: filterSubsidiary,
	                columns: ['taxidnum', 'custrecord_pe_detraccion_account']
	            });
	            
	            fedIdNumb = subLookup.taxidnum;
	            
	            recordAccount = subLookup.custrecord_pe_detraccion_account;

                recordAccount = JSON.stringify(recordAccount);
                detraccionAccountId = recordAccount.split('"')[3];
                detraccionAccountName = recordAccount.split('"')[7];
            }else{
            	fedIdNumb = configpage.getValue('employerid');

                companyname = configpage.getValue('legalname');

            	recordAccount = configpage.getValue('custrecord_pe_detraccion_account');

                detraccionAccountId = recordAccount;

                var accLookup = search.lookupFields({
                    type: search.Type.ACCOUNT,
                    id: recordAccount,
                    columns: ['name']
                });

                detraccionAccountName = accLookup.name;
            }
            
            var perLookup = search.lookupFields({
                type: search.Type.ACCOUNTING_PERIOD,
                id: filterPostingPeriod,
                columns: ['periodname']
            });
            var accLookup = search.lookupFields({
                type: search.Type.ACCOUNT,
                id: filterAccountBank,
                columns: ['name']
            });

            
            var accBankName = accLookup.name;
            var periodName = perLookup.periodname;

            var fileCabinetId = scriptObj.getParameter({
                name: 'custscript_pe_filecabinet_detracc_id'
            }); //223
          
            log.debug('File cabinet ID', fileCabinetId)

            try {
                log.debug({
                    title: 'INICIO',
                    details: 'INICIANDO SCHEDULED JOURNAL TEMPLATE: ' + fedIdNumb + ' - ' + fedIdNumb
                });
                //var cuentaRegistro = 0 ;
                var searchLoad = search.load({
                    id: searchId
                });
                var filters = searchLoad.filters; //reference Search.filters object to a new variable
                var filterOne = search.createFilter({ //create new filter
                    name: 'postingperiod',
                    operator: search.Operator.ANYOF,
                    values: filterPostingPeriod
                });
                filters.push(filterOne); //add the filter using .push() method

                if(featureSubsidiary || featureSubsidiary == 'T'){
                	var filterTwo = search.createFilter({ //create new filter
	                    name: 'subsidiary',
	                    operator: search.Operator.ANYOF,
	                    values: filterSubsidiary
	                });
	                filters.push(filterTwo); //add the filter using .push() method
                }

                var stringContentReport = '';
                var periodString = retornaPeriodoString(periodName);

                var folderReportGenerated = fileCabinetId;

                var result = searchLoad.run().getRange({
                    start: 0,
                    end: 1000
                }); //.each(function(result) {

                var i = 0;
                var cuentaMonto = parseFloat(0);
                var rucAdquiriente = '';
                var razAdquiriente = '';

                var d = new Date();

                log.debug({
                    title: 'date:',
                    details: 'Fecha: ' + d.getDate() + '. Dia de la semana: ' + d.getDay() +
                        '. Mes (0 al 11): ' + d.getMonth() + '. Año: ' + d.getFullYear() +
                        '. Hora: ' + d.getHours() + '. Hora UTC: ' + d.getUTCHours() +
                        '. Minutos: ' + d.getMinutes() + '. Segundos: ' + d.getSeconds()
                });

                var fechaHoraGen = d.getDate() + '' + (d.getMonth() + 1) + '' + d.getFullYear() + '' + d.getHours() + '' + d.getMinutes() + '' + d.getSeconds();

                var fechaGen = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() + '').substr(2, 4) + '';

                var fechaDetalle = d.getDate() + ('00' + (d.getMonth() + 1) + '').slice(-2) + (d.getFullYear() + '') + '';

                var fechaGenInic = '01/' + ('00' + (d.getMonth() + 1) + '').slice(-2) + '/' + (d.getFullYear() + '') + '';

                var customAccountingPeriod = search.create({
                    type: search.Type.ACCOUNTING_PERIOD,
                    columns: [{
                            name: 'internalId'
                        },
                        {
                            name: 'periodname'
                        }
                    ]
                });

                log.debug('fechaGenInic antes', fechaGenInic);

                var parsedSampleDate = format.parse({
                    value: fechaGenInic,
                    type: format.Type.DATE
                });

                log.debug('fechaGenInic antes', parsedSampleDate);

                var parsedSampleDate = format.format({
                    value: parsedSampleDate,
                    type: format.Type.DATE
                });

                log.debug('fechaGenInic despues', parsedSampleDate);

                customAccountingPeriod.filters = [
                    search.createFilter({
                        name: 'startdate',
                        operator: search.Operator.ON,
                        values: fechaGenInic
                    })
                ]

                var resultSet = customAccountingPeriod.run();
                var results = resultSet.getRange({
                    start: 0,
                    end: 1
                });
                var nameAcc = '';
                for (var i in results) {
                    // log.debug('Found custom list record', results[i]);
                    nameAcc = results[i].getValue({
                        name: 'periodname'
                    });
                };

                log.debug({
                    title: 'nameAcc',
                    details: 'nameAcc: ' + nameAcc
                });

                for (i; i < result.length; i++) {
                    var campoRegistro00 = result[i].getValue(searchLoad.columns[0]);
                    var campoRegistro01 = result[i].getValue(searchLoad.columns[1]);
                    if(featureSubsidiary || featureSubsidiary == 'T'){
                        var campoRegistro02 = result[i].getValue(searchLoad.columns[2]);
                        var campoRegistro03 = result[i].getValue(searchLoad.columns[3]);
                    }else{
                        var campoRegistro02 = fedIdNumb;
                        var campoRegistro03 = companyname;
                    }
                    rucAdquiriente = campoRegistro02;
                    razAdquiriente = campoRegistro03;
                    if (razAdquiriente == '- None -') {
                        razAdquiriente = '';
                    }
                    if (razAdquiriente.length >= 35) {
                        razAdquiriente = razAdquiriente.substr(0, 35);
                    } else {
                        razAdquiriente = ('                                   ' + razAdquiriente).slice(-35);
                    }
                    var campoRegistro04 = result[i].getValue(searchLoad.columns[4]);
                    var campoRegistro05 = result[i].getValue(searchLoad.columns[5]);
                    var campoRegistro06 = result[i].getValue(searchLoad.columns[6]);
                    var campoRegistro07 = result[i].getValue(searchLoad.columns[7]);
                    var campoRegistro08 = result[i].getValue(searchLoad.columns[8]);
                    var campoRegistro09 = result[i].getValue(searchLoad.columns[9]);
                    if (campoRegistro09 == '- None -') {
                        campoRegistro09 = '';
                    }
                    campoRegistro09 = ('000' + campoRegistro09).slice(-3);
                    var campoRegistro10 = result[i].getValue(searchLoad.columns[10]);
                    if (campoRegistro10 == '- None -') {
                        campoRegistro10 = '';
                    }
                    campoRegistro10 = ('00000000000' + campoRegistro10).slice(-11);
                    var campoRegistro11 = result[i].getValue(searchLoad.columns[11]);
                    //cuentaMonto     = (parseFloat(cuentaMonto).toFixed(2) + parseFloat(campoRegistro11).toFixed(2));
                    campoRegistro11 = parseFloat(campoRegistro11).toFixed(2);
                    cuentaMonto = parseFloat(cuentaMonto) + parseFloat(campoRegistro11);
                    campoRegistro11 = campoRegistro11.replace('.', '');
                    campoRegistro11 = campoRegistro11.replace(',', '');
                    campoRegistro11 = ('000000000000000' + campoRegistro11).slice(-15);
                    var campoRegistro12 = result[i].getValue(searchLoad.columns[12]);
                    if (campoRegistro12 == '- None -') {
                        campoRegistro12 = '';
                    }
                    campoRegistro12 = ('00' + campoRegistro12).slice(-2);
                    var campoRegistro13 = result[i].getValue(searchLoad.columns[13]);
                    var campoRegistro14 = result[i].getValue(searchLoad.columns[14]);

                    var campoRegistro15 = result[i].getValue(searchLoad.columns[15]);
                    campoRegistro15 = ('0000' + campoRegistro15).slice(-4);
                    var campoRegistro16 = result[i].getValue(searchLoad.columns[16]);
                    campoRegistro16 = ('00000000' + campoRegistro16).slice(-8);
                    var campoRegistro17 = result[i].getValue(searchLoad.columns[17]);
					var campoRegistro18 = result[i].getValue(searchLoad.columns[18]);
                    var campoRegistro19 = result[i].getValue(searchLoad.columns[19]);
                    var campoRegistro20 = result[i].getValue(searchLoad.columns[20]);
                    var campoRegistro21 = result[i].getValue(searchLoad.columns[21]);
					
                    if(!featureSubsidiary){
                        filterSubsidiary = '';
                    }
					
                    stringContentReport =
                        stringContentReport +
                        'DET' + fechaDetalle + ',' +
                        filterSubsidiary + ',' +
                        'Soles' + ',' +
                        '1' + ',' +
                        fechaGen + ',' + 
                        nameAcc + ',' +
                        detraccionAccountName + ',' +
                        result[i].getValue(searchLoad.columns[11]) + ',' +
                        '0' + ',' +
                        ',' +
                        ',' +
                        ',' +
                        ',' +
                        'Pago de Detracciones Periodo ' + periodName + ',' +
                        detraccionAccountId + ',' +
                        'Yes' + ',' +
                        'Yes' + ',' +
                        campoRegistro21 + ',' +
                        campoRegistro20 + ',' +
                        ',' +
                        ',' +
                        campoRegistro07 + ',' +
                        campoRegistro15 + '-' + campoRegistro16 +
                        '\n';
                };

                log.debug('stringContentReport', stringContentReport);

                cuentaMonto = parseFloat(cuentaMonto).toFixed(2) + '';
                /*cuentaMonto = cuentaMonto.replace('.','');
                cuentaMonto = cuentaMonto.replace(',','');
                cuentaMonto = ('000000000000000'+cuentaMonto).slice(-15);*/

                var lineaPrincipal = 'External ID,Subsidiary,Currency,Exchange Rate,Date,Posting Period,Account,Debit,Credit,Department,Location,Class,Name,Memo,Account ID,PE Detraccion,PE LN Detraccion,PE LN Vendor,PE LN Bill Detraccion,PE LN Detraccion Date,PE LN Detraccion Number,Proveedor,Numero de Documento';

                if(!featureSubsidiary){
                    filterSubsidiary = '';
                }

                var lineaFinal = 'DET' + fechaDetalle + ',' +
                    filterSubsidiary + ',' +
                    'Soles' + ',' +
                    '1' + ',' +
                    fechaGen + ',' + 
                    nameAcc + ',' +
                    accBankName + ',' +
                    '0' + ',' +
                    cuentaMonto + ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',' +
                    'Pago de Detracciones Periodo ' + periodName + ',' +
                    filterAccountBank + ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',' +
                    ',';

                stringContentReport = lineaPrincipal + '\n' + stringContentReport + lineaFinal;

                var nameReportGenerated = 'D' + fedIdNumb + periodString + '_' + fechaHoraGen;
                var fileObj = file.create({
                    name: nameReportGenerated + '.CSV',
                    fileType: file.Type.CSV,
                    contents: stringContentReport,
                    encoding: file.Encoding.UTF8,
                    folder: folderReportGenerated,
                    isOnline: true
                });
                var fileId = fileObj.save();
                var fileAux = file.load({
                    id: fileId
                });
                log.debug({
                    title: 'myObj',
                    details: 'FINALIZANDO DETRACCIONES JOURNAL TEMPLATE, FILE GENERADO ' + fileId
                });
                var customRecord = record.create({
                    type: 'customrecord_pe_generation_logs',
                    isDynamic: true
                });
                if(featureSubsidiary || featureSubsidiary == 'T'){
                    var nameData = {
                        custrecord_pe_subsidiary_log: parseInt(filterSubsidiary, 10),
                        custrecord_pe_periodo_log: filterPostingPeriod,
                        custrecord_pe_report_log: nameReportGenerated,
                        custrecord_pe_status_log: 'Generated',
                        custrecord_pe_file_cabinet_log: fileAux.url + '&_xd=T',
                        custrecord_pe_book_log: 'Detracciones JOURNAL TEMPLATE'
                    };
                }else{
                    var nameData = {
                        custrecord_pe_periodo_log: filterPostingPeriod,
                        custrecord_pe_report_log: nameReportGenerated,
                        custrecord_pe_status_log: 'Generated',
                        custrecord_pe_file_cabinet_log: fileAux.url + '&_xd=T',
                        custrecord_pe_book_log: 'Detracciones JOURNAL TEMPLATE'
                    };
                }
                for (var key in nameData) {
                    if (nameData.hasOwnProperty(key)) {
                        customRecord.setValue({
                            fieldId: key,
                            value: nameData[key]
                        });
                    }
                }
                var recordId = customRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: false
                });
            } catch (err) {
                /*var subject = 'Fatal Error: Unable to transform salesorder to item fulfillment!';
                var authorId = -5;
                var recipientEmail = 'jesusc1967@hotmail.com';
                email.send({
                    author: authorId,
                    recipients: recipientEmail,
                    subject: subject,
                    body: 'Fatal error occurred in script: ' + runtime.getCurrentScript().id + '\n\n' + JSON.stringify(e)
                });*/
                log.error('err', err)
            }
        }

        function corregirLongitud(valorCampo, formatoCampo, longitudCampo) {
            if (valorCampo != '') {
                if (!isNaN(valorCampo)) {
                    if (valorCampo.length <= longitudCampo * -1) {
                        valorCampo = (formatoCampo + valorCampo).slice(longitudCampo);
                    } else {
                        valorCampo = valorCampo.substr(valorCampo.length + longitudCampo);
                    }
                }
                if (isNaN(valorCampo)) {
                    if (valorCampo.length > longitudCampo * -1) {
                        valorCampo = valorCampo.substr(valorCampo.length + longitudCampo);
                    }
                }
            }
            return valorCampo;
        }

        function retornaPeriodoString(campoRegistro01) {
            if (campoRegistro01 >= '') {
                var valorAnio = campoRegistro01.split(' ')[1];
                var valorMes = campoRegistro01.split(' ')[0];
                if (valorMes.indexOf('Jan') >= 0 || valorMes.indexOf('Ene') >= 0) {
                    valorMes = '01';
                } else {
                    if (valorMes.indexOf('Feb') >= 0) {
                        valorMes = '02';
                    } else {
                        if (valorMes.indexOf('Mar') >= 0) {
                            valorMes = '03';
                        } else {
                            if (valorMes.indexOf('Abr') >= 0 || valorMes.indexOf('Apr') >= 0) {
                                valorMes = '04';
                            } else {
                                if (valorMes.indexOf('May') >= 0) {
                                    valorMes = '05';
                                } else {
                                    if (valorMes.indexOf('Jun') >= 0) {
                                        valorMes = '06';
                                    } else {
                                        if (valorMes.indexOf('Jul') >= 0) {
                                            valorMes = '07';
                                        } else {
                                            if (valorMes.indexOf('Aug') >= 0 || valorMes.indexOf('Ago') >= 0) {
                                                valorMes = '08';
                                            } else {
                                                if (valorMes.indexOf('Set') >= 0 || valorMes.indexOf('Sep') >= 0) {
                                                    valorMes = '09';
                                                } else {
                                                    if (valorMes.indexOf('Oct') >= 0) {
                                                        valorMes = '10';
                                                    } else {
                                                        if (valorMes.indexOf('Nov') >= 0) {
                                                            valorMes = '11';
                                                        } else {
                                                            valorMes = '12';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                campoRegistro01 = valorAnio.substr(2, 4) + valorMes;
            }
            return campoRegistro01;
        }
        return {
            execute: execute
        };
    });