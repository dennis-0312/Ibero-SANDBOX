/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/runtime', 'N/log', 'N/file', 'N/task', "N/config"], (search, record, runtime, log, file, task, config) => {
    // Schedule Report: Mensual: Reg. de Compras 8.1/8.2
    const execute = (context) => {
        try {
            const featureSubsidiary = runtime.isFeatureInEffect({ feature: 'SUBSIDIARIES' });
            const searchId = 'customsearch_pe_registro_de_compra_8_1';
            var logrecodId = 'customrecord_pe_generation_logs';
            let fedIdNumb = '';
            let hasinfo = 0;

            const params = getParams();

            if (featureSubsidiary) {
                const getruc = getRUC(params.filterSubsidiary)
                fedIdNumb = getruc;
            } else {
                const employerid = getEmployerID();
                fedIdNumb = employerid;
            }

            var createrecord = createRecord(logrecodId, featureSubsidiary, params.filterSubsidiary, params.filterPostingPeriod);
            const searchbook = searchBook(params.filterSubsidiary, params.filterPostingPeriod, searchId, featureSubsidiary);
            log.debug({ title: 'searchBook', details: searchbook });
            if (searchbook.thereisinfo == 1) {
                hasinfo = '1';
                const structuregbody = structureBody(searchbook.content);
                const createfile = createFile(params.filterPostingPeriod, fedIdNumb, hasinfo, createrecord.recordlogid, params.filterFormat, structuregbody, params.fileCabinetId);
                const statusProcess = setRecord(createrecord.irecord, createrecord.recordlogid, createfile, logrecodId);
                execute_LE_8_1_Exp(params.filterSubsidiary, params.filterPostingPeriod, createfile, params.filterFormat, statusProcess, params.incluirFlag, params.fileCabinetId)
                log.debug({ title: 'FinalResponse', details: 'Estado del proceso: ' + statusProcess + ' OK!!' });
            } else {
                setVoid(createrecord.irecord, logrecodId, createrecord.recordlogid);
                log.debug({ title: 'FinalResponse', details: 'No hay registros para la solicitud: ' + createrecord.recordlogid });
            }
        } catch (e) {
            log.error({ title: 'ErrorInExecute', details: e });
            setError(createrecord.irecord, logrecodId, createrecord.recordlogid, e)
        }
    }


    const getParams = () => {
        try {
            const scriptObj = runtime.getCurrentScript();
            const filterSubsidiary = scriptObj.getParameter({ name: 'custscript_pe_subsidiary_ple_8_1' });
            const filterPostingPeriod = scriptObj.getParameter({ name: 'custscript_pe_period_ple_8_1' });
            const filterFormat = scriptObj.getParameter({ name: 'custscript_pe_formato_8_1' });
            const fileCabinetId = scriptObj.getParameter({ name: 'custscript_pe_filecabinetid_ple_8_1' });
            const incluirFlag = scriptObj.getParameter({ name: 'custscript_pe_incluir_8_1' });


            return {
                filterSubsidiary: filterSubsidiary,
                filterPostingPeriod: filterPostingPeriod,
                filterFormat: filterFormat,
                fileCabinetId: fileCabinetId,
                incluirFlag: incluirFlag
            }
        } catch (e) {
            log.error({ title: 'getParams', details: e });
        }
    }


    const getRUC = (filterSubsidiary) => {
        try {
            const subLookup = search.lookupFields({
                type: search.Type.SUBSIDIARY,
                id: filterSubsidiary,
                columns: ['taxidnum']
            });
            const ruc = subLookup.taxidnum;
            return ruc;
        } catch (e) {
            log.error({ title: 'getRUC', details: e });
        }
    }


    const getEmployerID = () => {
        const configpage = config.load({ type: config.Type.COMPANY_INFORMATION });
        const employeeid = configpage.getValue('employerid');
        return employeeid;
    }


    const createRecord = (logrecodId, featureSubsidiary, filterSubsidiary, filterPostingPeriod) => {
        try {
            const recordlog = record.create({ type: logrecodId });
            if (featureSubsidiary) {
                recordlog.setValue({ fieldId: 'custrecord_pe_subsidiary_log', value: filterSubsidiary });
            }
            recordlog.setValue({ fieldId: 'custrecord_pe_period_log', value: filterPostingPeriod });
            recordlog.setValue({ fieldId: 'custrecord_pe_status_log', value: "Procesando..." });
            recordlog.setValue({ fieldId: 'custrecord_pe_report_log', value: "Procesando..." });
            recordlog.setValue({ fieldId: 'custrecord_pe_book_log', value: 'Registro de Compras 8.1' });
            const recordlogid = recordlog.save();

            return { recordlogid: recordlogid, irecord: record };
        } catch (e) {
            log.error({ title: 'createRecord', details: e });
        }
    }


    const searchBook = (subsidiary, period, searchId, featureSubsidiary) => {
        let json = new Array();
        var searchResult;
        let division = 0.0;
        let laps = 0.0;
        let start = 0;
        let end = 1000;
        try {

            const searchLoad = search.load({
                id: searchId
            });

            let filters = searchLoad.filters;

            const filterOne = search.createFilter({
                name: 'postingperiod',
                operator: search.Operator.ANYOF,
                values: period
            });

            filters.push(filterOne);

            if (featureSubsidiary) {
                const filterTwo = search.createFilter({
                    name: 'subsidiary',
                    operator: search.Operator.ANYOF,
                    values: subsidiary
                });
                filters.push(filterTwo);
            }

            const searchResultCount = searchLoad.runPaged().count;

            if (searchResultCount != 0) {
                if (searchResultCount <= 4000) {
                    searchLoad.run().each((result) => {
                        const column01 = result.getValue(searchLoad.columns[0]);
                        const column02 = result.getValue(searchLoad.columns[1]);
                        const column03 = result.getValue(searchLoad.columns[2]);
                        const column04 = result.getValue(searchLoad.columns[3]);
                        const column05 = result.getValue(searchLoad.columns[4]);
                        const column06 = result.getValue(searchLoad.columns[5]);
                        let column07 = result.getValue(searchLoad.columns[6]);
                        if (column07 == '- None -') {
                            column07 = '';
                        }
                        let column08 = result.getValue(searchLoad.columns[7]);
                        if (column08 == '- None -') {
                            column08 = '';
                        }
                        const column09 = result.getValue(searchLoad.columns[8]);
                        const column10 = result.getValue(searchLoad.columns[9]);
                        let column11 = result.getValue(searchLoad.columns[10]);
                        if (column11 == '- None -') {
                            column11 = '';
                        }
                        let column12 = result.getValue(searchLoad.columns[11]);
                        if (column12 == '- None -') {
                            column12 = '';
                        }
                        const column13 = result.getValue(searchLoad.columns[12]);
                        let column14 = result.getValue(searchLoad.columns[13]);
                        column14 = parseFloat(column14).toFixed(2);
                        let column15 = result.getValue(searchLoad.columns[14]);
                        column15 = parseFloat(column15).toFixed(2);
                        let column16 = result.getValue(searchLoad.columns[15]);
                        column16 = parseFloat(column16).toFixed(2);
                        let column17 = result.getValue(searchLoad.columns[16]);
                        column17 = parseFloat(column17).toFixed(2);
                        let column18 = result.getValue(searchLoad.columns[17]);
                        column18 = parseFloat(column18).toFixed(2);
                        let column19 = result.getValue(searchLoad.columns[18]);
                        column19 = parseFloat(column19).toFixed(2);
                        let column20 = result.getValue(searchLoad.columns[19]);
                        column20 = parseFloat(column20).toFixed(2);
                        let column21 = result.getValue(searchLoad.columns[20]);
                        column21 = parseFloat(column21).toFixed(2);
                        let column22 = result.getValue(searchLoad.columns[21]);
                        column22 = parseFloat(column22).toFixed(2);
                        let column23 = result.getValue(searchLoad.columns[22]);
                        column23 = parseFloat(column23).toFixed(2);
                        let column24 = result.getValue(searchLoad.columns[23]);
                        column24 = parseFloat(column24).toFixed(2);
                        const column25 = result.getValue(searchLoad.columns[24]);
                        let column26 = result.getValue(searchLoad.columns[25]);
                        column26 = Number(column26).toFixed(3);
                        let column27 = result.getValue(searchLoad.columns[26]);
                        if (column27 == '- None -') {
                            column27 = '';
                        }
                        let column28 = result.getValue(searchLoad.columns[27]);
                        if (column28 == '- None -') {
                            column28 = '';
                        }
                        let column29 = result.getValue(searchLoad.columns[28]);
                        if (column29 == '- None -') {
                            column29 = '';
                        }
                        let column30 = result.getValue(searchLoad.columns[29]);
                        if (column30 == '- None -') {
                            column30 = '';
                        }
                        let column31 = result.getValue(searchLoad.columns[30]);
                        if (column31 == '- None -') {
                            column31 = '';
                        }
                        let column32 = result.getValue(searchLoad.columns[31]);
                        if (column32 == '- None -') {
                            column32 = '';
                        }
                        let column33 = result.getValue(searchLoad.columns[32]);
                        if (column33 == '- None -') {
                            column33 = '';
                        }
                        let column34 = result.getValue(searchLoad.columns[33]);
                        if (column34 == '- None -') {
                            column34 = '';
                        }
                        let column35 = result.getValue(searchLoad.columns[34]);
                        if (column35 == '- None -') {
                            column35 = '';
                        }
                        let column36 = result.getValue(searchLoad.columns[35]);
                        if (column36 == '- None -') {
                            column36 = '';
                        }
                        let column37 = result.getValue(searchLoad.columns[36]);
                        if (column37 == '- None -') {
                            column37 = '';
                        }
                        const column38 = result.getValue(searchLoad.columns[37]);
                        const column39 = result.getValue(searchLoad.columns[38]);
                        const column40 = result.getValue(searchLoad.columns[39]);
                        const column41 = result.getValue(searchLoad.columns[40]);
                        let column42 = result.getValue(searchLoad.columns[41]);
                        let periodoEmision = formatDate(column04)['anio'] + formatDate(column04)['mes'] + '00';
                        if ((column06 == '01' || column06 == '14') && (column01 == periodoEmision)) {
                            column42 = '1';
                        } else if ((column06 != '01' || column06 != '14' || column06 !='10' || column06 != '03') && (column01 == periodoEmision)) {
                            column42 = '0';
                        } else if ((column06 == '01' || column06 == '07' || column06 == '14') && (column01 != periodoEmision)) {
                            column42 = '6';
                        } else if ((column06 != '01' || column06 != '07' || column06 != '14' || column06 != '10' || column06 != '03') && (column01 != periodoEmision)) {
                            column42 = '7';
                        }

                        // if (column06 == '01' && (column01 == periodoEmision)) {
                        //     column42 = '1';
                        // } else if (column06 != '01' && (column01 == periodoEmision)) {
                        //     column42 = '0';
                        // } else if ((column06 == '01' || column06 == '07') && (column01 != periodoEmision)) {
                        //     column42 = '6';
                        // } else if ((column06 != '01' || column06 != '07') && (column01 != periodoEmision)) {
                        //     column42 = '7';
                        // }

                        const column43 = result.getValue(searchLoad.columns[42]);
                        const column44 = result.getValue(searchLoad.columns[43]);
                        const column45 = result.getValue(searchLoad.columns[44]);


                        json.push({
                            c1_periodo: column01,
                            c2_cuo: column02,
                            c3_correlativo: column03,
                            c4_fecha_de_emision: column04,
                            c5_fecha_vencimiento_pago: column05,
                            c6_tipo_comprobante: column06,
                            c7_serie_comprobante: column07,
                            c8_anio_emision_dua_dsi: column08,
                            c9_nro_comprobante: column09,
                            c10_importe_total_op_diarias: column10,
                            c11_tipo_doc_proveedor: column11,
                            c12_ruc_dni_proveedor: column12,
                            c13_apellidos_nombres_proveedor: column13,
                            c14_base_imponible_gravadas: column14,
                            c15_monto_igv_grav: column15,
                            c16_base_imponible_gravadas_no_gravadas: column16,
                            c17_monto_igv_grav_ngrav: column17,
                            c18_base_imponible_sin_cred_fiscal: column18,
                            c19_monto_igv_sin_cred_fiscal: column19,
                            c20_total_no_gravadas: column20,
                            c21_isc: column21,
                            c22_icbp: column22,
                            c23_otros_tributos_cargos: column23,
                            c24_total_comprobante_pago: column24,
                            c25_codigo_moneda: column25,
                            c26_tipo_cambio: column26,
                            c27_fecha_emision_comprobante_modificado: column27,
                            c28_tipo_comprobante_modificado: column28,
                            c29_serie_comprobante_modificado: column29,
                            c30_codigo_dependencia_aduanera: column30,
                            c31_nmro_comprobante_modificado: column31,
                            c32_fecha_emision_deposito_detraccion: column32,
                            c33_nmro_deposito_detraccion: column33,
                            c34_marca_comprobante_detraccion: column34,
                            c35_clasificacion_bienes_servicios: column35,
                            c36_id_contrato_operador_social: column36,
                            c37_inconsistencia_tipo_cambio: column37,
                            c38_inconsistencia_proveedor_no_habido: column38,
                            c39_inconsistencia_proveedor: column39,
                            c40_inconsistencia_dni: column40,
                            c41_id_comprobante_medio_pago: column41,
                            c42_id_oportunidad_anotacion: column42,
                            c43_periodo: column43,
                            c44_periodo_inicial: column44,
                            c45_periodo_final: column45,
                        });
                        return true;
                    });
                    return { thereisinfo: 1, content: json };
                } else {
                    division = searchResultCount / 1000;
                    laps = Math.round(division);
                    if (division > laps) {
                        laps = laps + 1
                    }
                    for (let i = 1; i <= laps; i++) {
                        if (i != laps) {
                            searchResult = searchLoad.run().getRange({ start: start, end: end });
                        } else {
                            searchResult = searchLoad.run().getRange({ start: start, end: searchResultCount });
                        }
                        for (let j in searchResult) {
                            const column01 = searchResult[j].getValue(searchLoad.columns[0]);
                            const column02 = searchResult[j].getValue(searchLoad.columns[1]);
                            const column03 = searchResult[j].getValue(searchLoad.columns[2]);
                            const column04 = searchResult[j].getValue(searchLoad.columns[3]);
                            const column05 = searchResult[j].getValue(searchLoad.columns[4]);
                            const column06 = searchResult[j].getValue(searchLoad.columns[5]);
                            let column07 = searchResult[j].getValue(searchLoad.columns[6]);
                            if (column07 == '- None -') {
                                column07 = '';
                            }
                            let column08 = searchResult[j].getValue(searchLoad.columns[7]);
                            if (column08 == '- None -') {
                                column08 = '';
                            }
                            const column09 = searchResult[j].getValue(searchLoad.columns[8]);
                            const column10 = searchResult[j].getValue(searchLoad.columns[9]);
                            let column11 = searchResult[j].getValue(searchLoad.columns[10]);
                            if (column11 == '- None -') {
                                column11 = '';
                            }
                            let column12 = searchResult[j].getValue(searchLoad.columns[11]);
                            if (column12 == '- None -') {
                                column12 = '';
                            }
                            const column13 = searchResult[j].getValue(searchLoad.columns[12]);
                            let column14 = searchResult[j].getValue(searchLoad.columns[13]);
                            column14 = parseFloat(column14).toFixed(2);
                            let column15 = searchResult[j].getValue(searchLoad.columns[14]);
                            column15 = parseFloat(column15).toFixed(2);
                            let column16 = searchResult[j].getValue(searchLoad.columns[15]);
                            column16 = parseFloat(column16).toFixed(2);
                            let column17 = searchResult[j].getValue(searchLoad.columns[16]);
                            column17 = parseFloat(column17).toFixed(2);
                            let column18 = searchResult[j].getValue(searchLoad.columns[17]);
                            column18 = parseFloat(column18).toFixed(2);
                            let column19 = searchResult[j].getValue(searchLoad.columns[18]);
                            column19 = parseFloat(column19).toFixed(2);
                            let column20 = searchResult[j].getValue(searchLoad.columns[19]);
                            column20 = parseFloat(column20).toFixed(2);
                            let column21 = searchResult[j].getValue(searchLoad.columns[20]);
                            column21 = parseFloat(column21).toFixed(2);
                            let column22 = searchResult[j].getValue(searchLoad.columns[21]);
                            column22 = parseFloat(column22).toFixed(2);
                            let column23 = searchResult[j].getValue(searchLoad.columns[22]);
                            column23 = parseFloat(column23).toFixed(2);
                            let column24 = searchResult[j].getValue(searchLoad.columns[23]);
                            column24 = parseFloat(column24).toFixed(2);
                            const column25 = searchResult[j].getValue(searchLoad.columns[24]);
                            let column26 = searchResult[j].getValue(searchLoad.columns[25]);
                            column26 = Number(column26).toFixed(3);
                            let column27 = searchResult[j].getValue(searchLoad.columns[26]);
                            if (column27 == '- None -') {
                                column27 = '';
                            }
                            let column28 = searchResult[j].getValue(searchLoad.columns[27]);
                            if (column28 == '- None -') {
                                column28 = '';
                            }
                            let column29 = searchResult[j].getValue(searchLoad.columns[28]);
                            if (column29 == '- None -') {
                                column29 = '';
                            }
                            let column30 = searchResult[j].getValue(searchLoad.columns[29]);
                            if (column30 == '- None -') {
                                column30 = '';
                            }
                            let column31 = searchResult[j].getValue(searchLoad.columns[30]);
                            if (column31 == '- None -') {
                                column31 = '';
                            }
                            let column32 = searchResult[j].getValue(searchLoad.columns[31]);
                            if (column32 == '- None -') {
                                column32 = '';
                            }
                            let column33 = searchResult[j].getValue(searchLoad.columns[32]);
                            if (column33 == '- None -') {
                                column33 = '';
                            }
                            let column34 = searchResult[j].getValue(searchLoad.columns[33]);
                            if (column34 == '- None -') {
                                column34 = '';
                            }
                            let column35 = searchResult[j].getValue(searchLoad.columns[34]);
                            if (column35 == '- None -') {
                                column35 = '';
                            }
                            let column36 = searchResult[j].getValue(searchLoad.columns[35]);
                            if (column36 == '- None -') {
                                column36 = '';
                            }
                            let column37 = searchResult[j].getValue(searchLoad.columns[36]);
                            if (column37 == '- None -') {
                                column37 = '';
                            }
                            const column38 = searchResult[j].getValue(searchLoad.columns[37]);
                            const column39 = searchResult[j].getValue(searchLoad.columns[38]);
                            const column40 = searchResult[j].getValue(searchLoad.columns[39]);
                            const column41 = searchResult[j].getValue(searchLoad.columns[40]);
                            let column42 = searchResult[j].getValue(searchLoad.columns[41]);
                            let periodoEmision = formatDate(column04)['anio'] + formatDate(column04)['mes'] + '00';
                            if (column06 == '01' && (column01 == periodoEmision)) {
                                column42 = '1';
                            } else if (column06 != '01' && (column01 == periodoEmision)) {
                                column42 = '0';
                            } else if ((column06 == '01' || column06 == '07' || column06 == '30') && (column01 != periodoEmision)) {
                                column42 = '6';
                            } else if ((column06 != '01' || column06 != '07' || column06 != '30') && (column01 != periodoEmision)) {
                                column42 = '7';
                            }
                            const column43 = searchResult[j].getValue(searchLoad.columns[42]);
                            const column44 = searchResult[j].getValue(searchLoad.columns[43]);
                            const column45 = searchResult[j].getValue(searchLoad.columns[44]);


                            json.push({
                                c1_periodo: column01,
                                c2_cuo: column02,
                                c3_correlativo: column03,
                                c4_fecha_de_emision: column04,
                                c5_fecha_vencimiento_pago: column05,
                                c6_tipo_comprobante: column06,
                                c7_serie_comprobante: column07,
                                c8_anio_emision_dua_dsi: column08,
                                c9_nro_comprobante: column09,
                                c10_importe_total_op_diarias: column10,
                                c11_tipo_doc_proveedor: column11,
                                c12_ruc_dni_proveedor: column12,
                                c13_apellidos_nombres_proveedor: column13,
                                c14_base_imponible_gravadas: column14,
                                c15_monto_igv_grav: column15,
                                c16_base_imponible_gravadas_no_gravadas: column16,
                                c17_monto_igv_grav_ngrav: column17,
                                c18_base_imponible_sin_cred_fiscal: column18,
                                c19_monto_igv_sin_cred_fiscal: column19,
                                c20_total_no_gravadas: column20,
                                c21_isc: column21,
                                c22_icbp: column22,
                                c23_otros_tributos_cargos: column23,
                                c24_total_comprobante_pago: column24,
                                c25_codigo_moneda: column25,
                                c26_tipo_cambio: column26,
                                c27_fecha_emision_comprobante_modificado: column27,
                                c28_tipo_comprobante_modificado: column28,
                                c29_serie_comprobante_modificado: column29,
                                c30_codigo_dependencia_aduanera: column30,
                                c31_nmro_comprobante_modificado: column31,
                                c32_fecha_emision_deposito_detraccion: column32,
                                c33_nmro_deposito_detraccion: column33,
                                c34_marca_comprobante_detraccion: column34,
                                c35_clasificacion_bienes_servicios: column35,
                                c36_id_contrato_operador_social: column36,
                                c37_inconsistencia_tipo_cambio: column37,
                                c38_inconsistencia_proveedor_no_habido: column38,
                                c39_inconsistencia_proveedor: column39,
                                c40_inconsistencia_dni: column40,
                                c41_id_comprobante_medio_pago: column41,
                                c42_id_oportunidad_anotacion: column42,
                                c43_periodo: column43,
                                c44_periodo_inicial: column44,
                                c45_periodo_final: column45,
                            });
                        }
                        start = start + 1000;
                        end = end + 1000;
                    }
                    return { thereisinfo: 1, content: json };
                }
            }
            else {
                return { thereisinfo: 0 }
            }
        } catch (e) {
            log.error({ title: 'searchBook', details: e });
        }
    }


    const structureBody = (searchResult) => {
        let contentReport = '';
        try {
            for (let i in searchResult) {
                contentReport =
                    contentReport + searchResult[i].c1_periodo + '|' + searchResult[i].c2_cuo + '|' + searchResult[i].c3_correlativo + '|' +
                    searchResult[i].c4_fecha_de_emision + '|' + searchResult[i].c5_fecha_vencimiento_pago + '|' + searchResult[i].c6_tipo_comprobante + '|' +
                    searchResult[i].c7_serie_comprobante + '|' + searchResult[i].c8_anio_emision_dua_dsi + '|' + searchResult[i].c9_nro_comprobante + '|' +
                    searchResult[i].c10_importe_total_op_diarias + '|' + searchResult[i].c11_tipo_doc_proveedor + '|' + searchResult[i].c12_ruc_dni_proveedor + '|' +
                    searchResult[i].c13_apellidos_nombres_proveedor + '|' + searchResult[i].c14_base_imponible_gravadas + '|' + searchResult[i].c15_monto_igv_grav + '|' + searchResult[i].c16_base_imponible_gravadas_no_gravadas + '|' +
                    searchResult[i].c17_monto_igv_grav_ngrav + '|' + searchResult[i].c18_base_imponible_sin_cred_fiscal + '|' + searchResult[i].c19_monto_igv_sin_cred_fiscal + '|' + searchResult[i].c20_total_no_gravadas + '|' + searchResult[i].c21_isc + '|' +
                    searchResult[i].c22_icbp + '|' + searchResult[i].c23_otros_tributos_cargos + '|' + searchResult[i].c24_total_comprobante_pago + '|' +
                    searchResult[i].c25_codigo_moneda + '|' + searchResult[i].c26_tipo_cambio + '|' + searchResult[i].c27_fecha_emision_comprobante_modificado + '|' + searchResult[i].c28_tipo_comprobante_modificado + '|' +
                    searchResult[i].c29_serie_comprobante_modificado + '|' + searchResult[i].c30_codigo_dependencia_aduanera + '|' + searchResult[i].c31_nmro_comprobante_modificado + '|' + searchResult[i].c32_fecha_emision_deposito_detraccion + '|' +
                    searchResult[i].c33_nmro_deposito_detraccion + '|' + searchResult[i].c34_marca_comprobante_detraccion + '|' + searchResult[i].c35_clasificacion_bienes_servicios + '|' + searchResult[i].c36_id_contrato_operador_social + '|' +
                    searchResult[i].c37_inconsistencia_tipo_cambio + '|' + searchResult[i].c38_inconsistencia_proveedor_no_habido + '|' + searchResult[i].c39_inconsistencia_proveedor + '|' + searchResult[i].c40_inconsistencia_dni + '|' +
                    searchResult[i].c41_id_comprobante_medio_pago + '|' + searchResult[i].c42_id_oportunidad_anotacion + '|' + searchResult[i].c43_periodo + '|' + + searchResult[i].c44_periodo_inicial + '|' + searchResult[i].c45_periodo_final + '|\n';
            }

            return contentReport;

        } catch (e) {
            log.error({ title: 'structureBody', details: e });
        }
    }


    const createFile = (filterPostingPeriod, fedIdNumb, hasinfo, recordlogid, filterFormat, structuregbody, fileCabinetId) => {
        let typeformat;
        const header = 'Periodo|' +
            'Numero correlativo del mes o Codigo unico de la Operacion (CUO)|' +
            'Numero correlativo del asiento contable|' +
            'Fecha de emision del comprobante de pago o documento|' +
            'Fecha de Vencimiento o Fecha de Pago|' +
            'Tipo de Comprobante de Pago o Documento|' +
            'Serie del comprobante de pago o documento|' +
            'Emision de la DUA o DSI|' +
            'Numero del comprobante de pago o documento|' +
            'En caso de optar por anotar el importe total de las operaciones diarias |' +
            'Tipo de Documento de Identidad del proveedor|' +
            'Numero de RUC del proveedor o numero de documento de Identidad|' +
            'Apellidos y nombres denominacion o razon social  del proveedor|' +
            'Base imponible de las adquisiciones gravadas que dan derecho a credito fiscal|' +
            'Monto del Impuesto General a las Ventas|' +
            'Base imponible de las adquisiciones gravadas que dan derecho a credito fiscal|' +
            'Monto del Impuesto General a las Ventas|' +
            'Base imponible de las adquisiciones gravadas que no dan derecho a credito fiscal |' +
            'Monto del Impuesto General a las Ventas|' +
            'Valor de las adquisiciones no gravadas|' +
            'Monto del Impuesto Selectivo al Consumo|' +
            'Impuesto al Consumo de las Bolsas de Plastico|' +
            'Otros conceptos tributos y cargos que no formen parte de la base imponible|' +
            'Importe total de las adquisiciones registradas segun comprobante de pago|' +
            'Codigo  de la Moneda|' +
            'Tipo de cambio|' +
            'Fecha de emision del comprobante de pago que se modifica|' +
            'Tipo de comprobante de pago que se modifica|' +
            'Numero de serie del comprobante de pago que se modifica|' +
            'Codigo de la dependencia Aduanera de la Declaracion unica de Aduanas (DUA)|' +
            'Numero del comprobante de pago que se modifica|' +
            'Fecha de emision de la Constancia de Deposito de Detraccion|' +
            'Numero de la Constancia de Deposito de Detraccion|' +
            'Marca del comprobante de pago sujeto a retencion|' +
            'Clasificacion de los bienes y servicios adquiridos|' +
            'Identificacion del Contrato o del proyecto en el caso de los Operadores de las sociedades irregulares|' +
            'Error tipo 1|' +
            'Error tipo 2|' +
            'Error tipo 3|' +
            'Error tipo 4|' +
            'Indicador de Comprobantes de pago cancelados con medios de pago|' +
            'Estado que identifica la oportunidad de la anotacion o indicacion si esta corresponde a un ajuste|\n';
        try {
            const periodname = getPeriodName(filterPostingPeriod);
            const periodostring = retornaPeriodoString(periodname);
            let nameReportGenerated = 'LE' + fedIdNumb + periodostring + '080100' + '00' + '1' + hasinfo + '11_' + recordlogid;

            if (filterFormat == 'CSV') {
                nameReportGenerated = nameReportGenerated + '.csv';
                structuregbody = header + structuregbody;
                structuregbody = structuregbody.replace(/[,]/gi, ' ');
                structuregbody = structuregbody.replace(/[|]/gi, ',');
                typeformat = file.Type.CSV;
            } else {
                nameReportGenerated = nameReportGenerated + '.txt';
                typeformat = file.Type.PLAINTEXT;
            }
            const fileObj = file.create({
                name: nameReportGenerated,
                fileType: typeformat,
                contents: structuregbody,
                encoding: file.Encoding.UTF8,
                folder: fileCabinetId,
                isOnline: true
            });
            const fileId = fileObj.save();
            return fileId;
        } catch (e) {
            log.error({ title: 'createFile', details: e });
        }
    }


    const setRecord = (irecord, recordlogid, fileid, logrecodId) => {
        try {
            const fileAux = file.load({ id: fileid });
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_file_cabinet_log: fileAux.url + '&_xd=T' } });
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_status_log: 'Generated' } });
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_report_log: fileAux.name } });
            return recordlogid;
        } catch (e) {
            log.error({ title: 'setRecord', details: e });
        }
    }


    const setError = (irecord, logrecodId, recordlogid, error) => {
        try {
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_status_log: 'ERROR: ' + error } });
        } catch (e) {
            log.error({ title: 'setError', details: e });
        }
    }


    const setVoid = (irecord, logrecodId, recordlogid, estado) => {
        try {
            const estado = 'No hay registros';
            const report = 'Proceso finalizado';
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_status_log: estado } });
            irecord.submitFields({ type: logrecodId, id: recordlogid, values: { custrecord_pe_report_log: report } });
        } catch (e) {
            log.error({ title: 'setVoid', details: e });
        }
    }


    const getPeriodName = (filterPostingPeriod) => {
        try {
            const perLookup = search.lookupFields({
                type: search.Type.ACCOUNTING_PERIOD,
                id: filterPostingPeriod,
                columns: ['periodname']
            });
            const period = perLookup.periodname;
            return period;
        } catch (e) {
            log.error({ title: 'getPeriodName', details: e });
        }
    }


    const retornaPeriodoString = (column01) => {
        if (column01 >= '') {
            var valorAnio = column01.split(' ')[1];
            var valorMes = column01.split(' ')[0].toLowerCase();
            if (valorMes.indexOf('Jan') >= 0 || valorMes.indexOf('ene') >= 0) {
                valorMes = '01';
            } else {
                if (valorMes.indexOf('feb') >= 0 || valorMes.indexOf('feb') >= 0) {
                    valorMes = '02';
                } else {
                    if (valorMes.indexOf('mar') >= 0 || valorMes.indexOf('mar') >= 0) {
                        valorMes = '03';
                    } else {
                        if (valorMes.indexOf('abr') >= 0 || valorMes.indexOf('apr') >= 0) {
                            valorMes = '04';
                        } else {
                            if (valorMes.indexOf('may') >= 0 || valorMes.indexOf('may') >= 0) {
                                valorMes = '05';
                            } else {
                                if (valorMes.indexOf('jun') >= 0 || valorMes.indexOf('jun') >= 0) {
                                    valorMes = '06';
                                } else {
                                    if (valorMes.indexOf('jul') >= 0 || valorMes.indexOf('jul') >= 0) {
                                        valorMes = '07';
                                    } else {
                                        if (valorMes.indexOf('aug') >= 0 || valorMes.indexOf('ago') >= 0) {
                                            valorMes = '08';
                                        } else {
                                            if (valorMes.indexOf('set') >= 0 || valorMes.indexOf('sep') >= 0) {
                                                valorMes = '09';
                                            } else {
                                                if (valorMes.indexOf('oct') >= 0) {
                                                    valorMes = '10';
                                                } else {
                                                    if (valorMes.indexOf('nov') >= 0) {
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
            column01 = valorAnio + valorMes + '00';
        }
        return column01;
    }

    // CONVIERTE A LA FECHA EN FORMATO JSON
    function formatDate(dateString) {
        try {
            var date = dateString.split('/');
            if (Number(date[0]) < 10) date[0] = '0' + Number(date[0]);
            if (Number(date[1]) < 10) date[1] = '0' + Number(date[1]);

            return { 'anio': date[2], 'mes': date[1], 'dia': date[0] }

        } catch (e) {
            log.error('Error en formatDate', e);
        }
    }


    function execute_LE_8_1_Exp(filterSubsidiary, filterPostingPeriod, filterArchivosGen, filterFormat, statusProcess, incluirFlag, fileCabinetId) {
        try {
            const scriptTask = task.create({
                taskType: task.TaskType.SCHEDULED_SCRIPT,
                scriptId: 'customscript_pe_schedule_ple_8_1_ex',
                deploymentId: 'customdeploy_pe_schedule_ple_8_1_ex',
                params: {
                    custscript_pe_subsidiary_ple_8_1_ex: filterSubsidiary,
                    custscript_pe_period_ple_8_1_ex: filterPostingPeriod,
                    custscript_pe_page_ple_8_1_ex: 0,
                    custscript_pe_archivos_gen_ple_8_1_ex: filterArchivosGen,
                    custscript_pe_formato_8_1_ex: filterFormat,
                    custscript_pe_id_log_2: statusProcess,
                    custscript_pe_incluir_8_2_ex: incluirFlag,
                    custscript_pe_filecabinet_id_ex: fileCabinetId
                }
            });
            scriptTask.submit();

        } catch (e) {
            log.error('Error en execute_LE_8_1_Exp', e);

        }
    }


    return {
        execute: execute
    }
});