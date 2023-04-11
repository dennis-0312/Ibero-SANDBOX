/**
 *@NApiVersion 2.x
 *@NScriptType plugintypeimpl
 *@NModuleScope Public
*/
define(['N/search', 'N/record', 'N/https', 'N/encode', 'N/file'],
    function (search, record, https, encode, file) {

        const SEARCH_GUIAS_REMISION = 'customsearch_pe_fel_itemfulfilment';
        const REC_GUIA_REMISION = 'itemfulfillment';
        const SALES_ORDER = 'salesorder';
        const VENDOR_AUTORIZATION = 'vendorreturnauthorization';
        const TRANSFER_ORDER = 'transferorder';
        const BUSQ_GUIA_REMISION = 'ItemShip';
        const ID_LIST_CONDUCTOR_SEC = 'recmachcustrecord_pe_nmro_guia_remision_con_sec';
        const ID_LIST_VEHICULO_SEC = 'recmachcustrecord_pe_nmro_guia_remision_veh_sec';
        const FOLDER_PDF_GR = 1465;          //SB: 2116   PR: 1465
        const FOLDER_EXCEPTIONS_GR = 1463;   //SB: 2115   PR: 1463
        const SUBSIDIARIA_IBERO = 1;
        const docstatus1 = 'Sending Failed';
        const docstatus2 = 'Parsing Failed';

        var internalId = '';
        var userId = '';

        function send(plugInContext) {
            result = {
                success: true,
                message: 'success'
            }
            try {
                internalId = plugInContext.transaction.id;
                userId = plugInContext.sender.id;
                var userMail = plugInContext.sender.email;
                var tranID = plugInContext.transaction.number;

                var array = [internalId, userId];
                var getcredentials = openCredentials();


                var urlsendinfo = getcredentials.wsurl + 'wsParser/rest/parserWS';
                var urlgetpdf = getcredentials.wsurl + 'wsBackend/clients/getDocumentPDF';
                var urlgetinfourl = getcredentials.wsurl + 'wsBackend/clients/getPdfURL';
                var urlgetxml = getcredentials.wsurl + 'wsBackend/clients/getDocumentXML';
                var urlgetcdr = getcredentials.wsurl + 'wsBackend/clients/getDocumentCDR';

                var tokensend = token();
                var tokenpdf = token();
                var tokenxml = token();
                var tokencdr = token();
                var tokenurl = token();

                var request = requestGuia(internalId);


                // !Activar para envío
                // Bloque de validación si documento ya existe en OSCE
                var existDocument = getDocumentPDF(getcredentials.username, getcredentials.password, request.typedoccode, request.serie, request.correlativo, tokenurl, urlgetinfourl, array);
                // var filetxt = generateFileTXT(request.numbering, request.request, array);
                // var res = 'Request: ' + filetxt;
                // logError(internalId, userId, docstatus1, res);

                sleep(1000);
                if (existDocument.codigo == '0') {
                    statustrasanction = '0';
                } else {
                    send = sendDocument(getcredentials.username, getcredentials.password, tokensend, urlsendinfo, request, array);
                    sleep(3000);
                    statustrasanction = send.responsecode;
                    logStatus(internalId, send.response + ', ticket:' + send.ticket);
                }


                //Bloque de ejecucíon de envío de documento
                if (statustrasanction == '0') {
                    var getpdf = getDocumentPDF(getcredentials.username, getcredentials.password, request.typedoccode, request.serie, request.correlativo, tokenpdf, urlgetpdf, array);
                    var getxml = getDocumentXML(getcredentials.username, getcredentials.password, request.typedoccode, request.serie, request.correlativo, tokenxml, urlgetxml, array);
                    var getcdr = getDocumentCDR(getcredentials.username, getcredentials.password, request.typedoccode, request.serie, request.correlativo, tokencdr, urlgetcdr, array);
                    sleep(3000);
                    // var devolucion = getpdf.mensaje + ' -- ' + getxml.mensaje + ' --- ' + getcdr.mensaje + ' ---------- ' + statustrasanction;
                    // logStatus(internalId, devolucion);
                    if (getpdf.mensaje == 'OK' && getxml.mensaje == 'OK' && getcdr.mensaje == 'OK') {
                        var filepdf = generateFilePDF(request.numbering, getpdf.pdf, array);
                        var filexml = generateFileXML(request.numbering, getxml.xml, array);
                        var filecdr = generateFileCDR(request.numbering, getcdr.cdr, array);
                        var filejson = generateFileJSON(request.numbering, request.request, array);
                        if (filepdf != '' && filexml != '' && filecdr != '' && filejson != '') {
                            var arrayheader = [userId, getcredentials.recipients, request.emisname, request.numbering, request.typedoc, docstatus, filepdf, filexml, filecdr, filejson, getpdf.pdf];
                            var arraybody = [internalId];
                            var sendemail = sendEmail(true, arrayheader, arraybody, recordtype, array);
                            //var respuesta = 'pdf: ' + filepdf + ' - xml: ' + filexml + ' - cdr: ' + filecdr + ' - json: ' + filejson + ' ---- ' + sendemail;
                            logStatus(internalId, sendemail);
                        } else {
                            logError(internalId, userId, docstatus2, 'Error en envío de email');
                            result.success = false;
                            result.message = "Failure";
                        }
                    } else {
                        logError(internalId, userId, docstatus2, 'Error en generación de archivos');
                        result.success = false;
                        result.message = "Failure";
                    }
                } else if (send.responsecode == '1033') {
                    logError(internalId, userId, docstatus1, send.response);
                    result.success = false;
                    result.message = "Failure";
                } else {
                    var filetxt = generateFileTXT(request.numbering, request.request, array);
                    var res = 'Request: ' + filetxt + ' - ' + send.response;
                    logError(internalId, userId, docstatus1, res);
                    result.success = false;
                    result.message = "Failure";
                }

            } catch (e) {

                //logError(internalId, userId, docstatus2, JSON.stringify(e));
                logError(internalId, userId, docstatus2, e);
                result.success = false;
                result.message = "Failure";

            }
            return result;

        }


        function requestGuia(_id_guia) {

            var json = new Array();
            var jsonMain = new Array();

            var json_ide = {};
            var json_emi = {};
            var json_dde = {};
            var json_grc = {};
            var json_gca = {};
            var array_grd = [];


            try {

                var searchLoad = search.create({
                    type: "itemfulfillment",
                    filters:
                        [
                            ["type", "anyof", BUSQ_GUIA_REMISION],
                            "AND",
                            ["internalid", "anyof", _id_guia]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "formulatext",
                                formula: "CONCAT({custbody_pe_serie}, CONCAT('-', {custbody_pe_number}))",
                                label: "1.IDE_numeracion"
                            }),
                            search.createColumn({
                                name: "formulatext",
                                formula: "TO_CHAR({trandate},'YYYY-MM-DD')",
                                label: "2.IDE_fechaEmision"
                            }),
                            search.createColumn({
                                name: "formulatext",
                                formula: "TO_CHAR({datecreated},'HH24:MI:SS')",
                                label: "3.IDE_horaEmision"
                            }),
                            search.createColumn({
                                name: "custrecord_pe_code_document_type",
                                join: "CUSTBODY_PE_DOCUMENT_TYPE",
                                label: "4.IDE_codTipoDocumento"
                            }),
                            search.createColumn({
                                name: "formulanumeric",
                                formula: "6",
                                label: "5.EMI_tipoDocId"
                            }),
                            search.createColumn({
                                name: "taxidnum",
                                join: "subsidiary",
                                label: "6.EMI_numeroDocId"
                            }),
                            search.createColumn({
                                name: "name",
                                join: "subsidiary",
                                label: "7.EMI_nombreComercial"
                            }),
                            search.createColumn({
                                name: "legalname",
                                join: "subsidiary",
                                label: "8.EMI_razonSocial"
                            }),
                            search.createColumn({
                                name: "city",
                                join: "subsidiary",
                                label: "9.EMI_ubigeo"
                            }),
                            search.createColumn({
                                name: "address1",
                                join: "subsidiary",
                                label: "10.EMI_direccion"
                            }),
                            search.createColumn({
                                name: "state",
                                join: "subsidiary",
                                label: "11.EMI_codigoPais"
                            }),
                            search.createColumn({
                                name: "phone",
                                join: "subsidiary",
                                label: "12.EMI_telefono"
                            }),
                            search.createColumn({
                                name: "email",
                                join: "subsidiary",
                                label: "13.EMI_correoElectronico"
                            }),
                            search.createColumn({
                                name: "custentity_pe_document_type",
                                join: "customer",
                                label: "14.DDE_tipoDocId_customer"
                            }),
                            search.createColumn({
                                name: "vatregnumber",
                                join: "customer",
                                label: "15.DDE_numeroDocId_customer"
                            }),
                            search.createColumn({
                                name: "companyname",
                                join: "customer",
                                label: "16.DDE_razonSocial_customer"
                            }),
                            search.createColumn({
                                name: "address1",
                                join: "customer",
                                label: "17.DDE_direccion_customer"
                            }),
                            search.createColumn({
                                name: "phone",
                                join: "customer",
                                label: "18.DDE_telefono_customer"
                            }),
                            search.createColumn({
                                name: "email",
                                join: "customer",
                                label: "19.DDE_correoElectronico_customer"
                            }),
                            search.createColumn({
                                name: "custrecord_pe_codigo_motivo_traslado",
                                join: "CUSTBODY_PE_MOTIVO_TRASLADO",
                                label: "20.GRC_motivoTraslado"
                            }),
                            search.createColumn({name: "custbody_pe_motivo_traslado", label: "21.GRC_descripcionMotivoTraslado"}),
                            search.createColumn({ name: "custbody_pe_peso_tn", label: "22.GRC_pesoBrutoBienes" }),
                            search.createColumn({
                                name: "custrecord_pe_code_measurement_unit",
                                join: "CUSTBODY_PE_UNIDAD_MEDIDA_PB",
                                label: "23.GRC_unidadMedidaPesoBruto"
                            }),
                            search.createColumn({
                                name: "custrecord_pe_cod_mod_traslado",
                                join: "CUSTBODY_PE_MODALIDAD_TRASLADO",
                                label: "24.GRC_modalidadTraslado"
                            }),
                            search.createColumn({
                                name: "formulatext",
                                formula: "TO_CHAR({custbodype_fecha_inicio_del_traslado},'YYYY-MM-DD')",
                                label: "25.GRC_fechaInicioTraslado"
                            }),
                            search.createColumn({ name: "custbody_pe_ruc_empresa_transporte", label: "26.GRC_numeroRucTransportista" }),
                            search.createColumn({
                                name: "custrecord_pe_cod_doc_type",
                                join: "CUSTBODY_PE_TIPO_DOC_TRANSPORTISTA",
                                label: "27.GRC_tipoDocTransportista"
                            }),
                            search.createColumn({ name: "custbody_pe_denominacion_transportador", label: "28.GRC_denominacionTransportador" }),
                            search.createColumn({ name: "custbody_pe_car_plate", label: "29.GRC_numeroPlacaVehiculo" }),
                            search.createColumn({ name: "custbody_pe_driver_document_number", label: "30.GRC_numeroDocIdeConductor" }),
                            search.createColumn({
                                name: "custrecord_pe_cod_doc_ide_conductor",
                                join: "CUSTBODY_PE_DOC_IDENTIDAD_CONDUCTOR",
                                label: "31.GRC_tipoDocIdeConductor"
                            }),
                            search.createColumn({
                                name: "custrecord_pe_codigo",
                                join: "CUSTBODY_PE_UBIGEO_PTO_LLEGADA",
                                label: "32.GRC_ubigeoPuntoLlegada"
                            }),
                            search.createColumn({ name: "custbody_pe_direccion_punto_llegada", label: "33.GRC_direccionPuntoLlegada" }),
                            search.createColumn({
                                name: "custrecord_pe_codigo",
                                join: "CUSTBODY_PE_UBIGEO_PTO_PARTIDA",
                                label: "34.GRC_ubigeoPuntoPartida"
                            }),
                            search.createColumn({ name: "custbody_pe_direccion_punto_partida", label: "35.GRC_direccionPuntoPartida" }),
                            search.createColumn({ name: "custbody_pe_tipo_conductor", label: "36.GCA_tipoConductor" }),
                            search.createColumn({ name: "custbody_pe_driver_name", label: "37.GCA_nomConductor" }),
                            search.createColumn({ name: "custbody_pe_driver_last_name", label: "38.GCA_apeConductor" }),
                            search.createColumn({ name: "custbody_pe_driver_license", label: "39.GCA_numLicCondConductor" }),
                            search.createColumn({ name: "custbody_pe_serie", label: "40.Serie" }),
                            search.createColumn({ name: "custbody_pe_number", label: "41.Correlativo" }),
                            search.createColumn({ name: "custbody_pe_document_type", label: "42.TipoDocumento" }),
                            search.createColumn({
                                name: "internalid",
                                join: "customer",
                                label: "43.CustomerId"
                            }),
                            search.createColumn({
                                name: "recordtype",
                                join: "createdFrom",
                                label: "44.CreatedFromType"
                            }),
                            search.createColumn({
                                name: "custentity_pe_document_type",
                                join: "vendor",
                                label: "45.DDE_tipoDocId_vendor"
                            }),
                            search.createColumn({
                                name: "vatregnumber",
                                join: "vendor",
                                label: "46.DDE_numeroDocId_vendor"
                            }),
                            search.createColumn({
                                name: "companyname",
                                join: "vendor",
                                label: "47.DDE_razonSocial_vendor"
                            }),
                            search.createColumn({
                                name: "address1",
                                join: "vendor",
                                label: "48.DDE_direccion_vendor"
                            }),
                            search.createColumn({
                                name: "phone",
                                join: "vendor",
                                label: "49.DDE_telefono_vendor"
                            }),
                            search.createColumn({
                                name: "email",
                                join: "vendor",
                                label: "50.DDE_correoElectronico_vendor"
                            })
                        ]
                });


                var searchResult = searchLoad.run().getRange({ start: 0, end: 1 });
                // IDE---------------------------------------------------------------------------------------------------------------------
                var column01 = searchResult[0].getValue(searchLoad.columns[0]);
                var column02 = searchResult[0].getValue(searchLoad.columns[1]);
                var column03 = searchResult[0].getValue(searchLoad.columns[2]);
                var column04 = searchResult[0].getValue(searchLoad.columns[3]);
                // EMI---------------------------------------------------------------------------------------------------------------------
                var column05 = searchResult[0].getValue(searchLoad.columns[4]);
                var column06 = searchResult[0].getValue(searchLoad.columns[5]);
                var column07 = searchResult[0].getValue(searchLoad.columns[6]);
                var column08 = searchResult[0].getValue(searchLoad.columns[7]);
                var column09 = searchResult[0].getValue(searchLoad.columns[8]);
                var column10 = searchResult[0].getValue(searchLoad.columns[9]);
                var column11 = searchResult[0].getValue(searchLoad.columns[10]);
                var column12 = searchResult[0].getValue(searchLoad.columns[11]);
                var column13 = searchResult[0].getValue(searchLoad.columns[12]);
                // DDE---------------------------------------------------------------------------------------------------------------------
                var column14 = searchResult[0].getValue(searchLoad.columns[13]);
                var column15 = searchResult[0].getValue(searchLoad.columns[14]);
                var column16 = searchResult[0].getValue(searchLoad.columns[15]);
                var column17 = searchResult[0].getValue(searchLoad.columns[16]);
                var column18 = searchResult[0].getValue(searchLoad.columns[17]);
                var column19 = searchResult[0].getValue(searchLoad.columns[18]);
                // GRC---------------------------------------------------------------------------------------------------------------------
                var column20 = searchResult[0].getValue(searchLoad.columns[19]);
                var column21 = searchResult[0].getText(searchLoad.columns[20]);
                var column22 = searchResult[0].getValue(searchLoad.columns[21]);
                var column23 = searchResult[0].getValue(searchLoad.columns[22]);
                var column24 = searchResult[0].getValue(searchLoad.columns[23]);
                var column25 = searchResult[0].getValue(searchLoad.columns[24]);
                var column26 = searchResult[0].getValue(searchLoad.columns[25]);
                var column27 = searchResult[0].getValue(searchLoad.columns[26]);
                var column28 = searchResult[0].getValue(searchLoad.columns[27]);
                var column29 = searchResult[0].getValue(searchLoad.columns[28]);
                var column30 = searchResult[0].getValue(searchLoad.columns[29]);
                var column31 = searchResult[0].getValue(searchLoad.columns[30]);
                var column32 = searchResult[0].getValue(searchLoad.columns[31]);
                var column33 = searchResult[0].getValue(searchLoad.columns[32]);
                var column34 = searchResult[0].getValue(searchLoad.columns[33]);
                var column35 = searchResult[0].getValue(searchLoad.columns[34]);
                // GCA----------------------------------------------------------------------------------------------------------------------
                var column36 = searchResult[0].getValue(searchLoad.columns[35]);
                var column37 = searchResult[0].getValue(searchLoad.columns[36]);
                var column38 = searchResult[0].getValue(searchLoad.columns[37]);
                var column39 = searchResult[0].getValue(searchLoad.columns[38]);
                // SERIE---------------------------------------------------------------------------------------------------------------------
                var column40 = searchResult[0].getText(searchLoad.columns[39]);
                // CORRELATIVO---------------------------------------------------------------------------------------------------------------
                var column41 = searchResult[0].getValue(searchLoad.columns[40]);
                // TIPO DOCUMENTO------------------------------------------------------------------------------------------------------------
                var column42 = searchResult[0].getText(searchLoad.columns[41]);
                // ID CUSTOMER------------------------------------------------------------------------------------------------------------
                var column43 = searchResult[0].getText(searchLoad.columns[42]);
                // CREATED FROM------------------------------------------------------------------------------------------------------------
                var column44 = searchResult[0].getValue(searchLoad.columns[43]);
                // DDE-Vendor---------------------------------------------------------------------------------------------------------------------
                var column45 = searchResult[0].getValue(searchLoad.columns[44]);
                var column46 = searchResult[0].getValue(searchLoad.columns[45]);
                var column47 = searchResult[0].getValue(searchLoad.columns[46]);
                var column48 = searchResult[0].getValue(searchLoad.columns[47]);
                var column49 = searchResult[0].getValue(searchLoad.columns[48]);
                var column50 = searchResult[0].getValue(searchLoad.columns[49]);



                json_ide.numeracion = column01;
                json_ide.fechaEmision = column02;
                json_ide.horaEmision = column03;
                json_ide.codTipoDocumento = column04;

                json_emi.tipoDocId = column05;
                json_emi.numeroDocId = column06;
                json_emi.nombreComercial = column07;
                json_emi.razonSocial = column08;
                //son_emi.ubigeo = '150122';
                json_emi.direccion = column10;
                json_emi.codigoPais = 'PE';
                json_emi.telefono = column12;
                json_emi.correoElectronico = column13;


                var tipoDocId = '';
                var numeroDocId = '';
                var razonSocial = '';
                var direccion = '';
                var telefono = '';
                var correoElectronico = '';

                if (column44 == SALES_ORDER) {

                    tipoDocId = column14;
                    numeroDocId = column15;
                    razonSocial = column16;
                    direccion = column17;
                    telefono = column18;
                    correoElectronico = column19;

                } else if (column44 == TRANSFER_ORDER) {

                    tipoDocId = column05;
                    numeroDocId = column06;
                    razonSocial = column08;
                    direccion = column10;
                    telefono = column12;
                    correoElectronico = column13;

                } else if (column44 == VENDOR_AUTORIZATION) {

                    tipoDocId = column45;
                    numeroDocId = column46;
                    razonSocial = column47;
                    direccion = column48;
                    telefono = column49;
                    correoElectronico = column50;

                }

                json_dde.tipoDocId = tipoDocId;
                json_dde.numeroDocId = numeroDocId;
                json_dde.razonSocial = razonSocial;
                json_dde.direccion = direccion;
                json_dde.telefono = telefono;
                json_dde.correoElectronico = correoElectronico;

                json_grc.idTraslado = column20;
                json_grc.motivoTraslado = column20;
                json_grc.descripcionMotivoTraslado = column21;
                json_grc.pesoBrutoBienes = column22;
                json_grc.unidadMedidaPesoBruto = column23;
                json_grc.modalidadTraslado = column24;
                json_grc.fechaInicioTraslado = column25;
                if (column24 == '01') {
                    json_grc.numeroRucTransportista = column26;
                    json_grc.tipoDocTransportista = column27;
                    json_grc.denominacionTransportador = column28;
                } else if (column24 == '02') {
                    json_grc.numeroPlacaVehiculo = column29;
                    json_grc.numeroDocIdeConductor = column30;
                    json_grc.tipoDocIdeConductor = column31;
                }
                json_grc.ubigeoPuntoLlegada = column32;
                json_grc.direccionPuntoLlegada = column33;
                json_grc.ubigeoPuntoPartida = column34;
                json_grc.direccionPuntoPartida = column35;


                var getDetails = getLinesDetails(_id_guia);
                json_gca.vehicSecundario = getDetails.vehiculos_secundarios;
                json_gca.tipoConductor = column36;
                json_gca.nomConductor = column37;
                json_gca.apeConductor = column38;
                json_gca.numLicCondConductor = column39;
                json_gca.conductoresSecundarios = getDetails.conductores_secundarios;


                array_grd = getDetails.items;

                jsonMain = {
                    IDE: json_ide,
                    EMI: json_emi,
                    DDE: json_dde,
                    GRC: json_grc,
                    GCA: json_gca,
                    GRD: array_grd
                }

                var filename = column06 + '-' + column04 + '-' + column01;
                if (column04 == '09') {
                    json = JSON.stringify({ "guiaRemision": jsonMain });
                }

                return {
                    request: json,
                    filenameosce: filename,
                    numbering: column01,
                    serie: column40,
                    correlativo: column41,
                    emailrec: column43,
                    emisname: column08,
                    typedoc: column42,
                    typedoccode: column04,
                }


            } catch (e) {
                logError(internalId, userId, 'Error-requestGuia', JSON.stringify(e));
            }
        }


        function getLinesDetails(_id_guia) {
            try {

                var arrCondSec = [];
                var arrVehSec = [];
                var arrItems = [];

                var recGuiaRemision = record.load({ type: REC_GUIA_REMISION, id: _id_guia, isDynamic: true });

                var recLinesItems = recGuiaRemision.getLineCount('item');
                var recLinesConductorSec = recGuiaRemision.getLineCount(ID_LIST_CONDUCTOR_SEC);
                var recLinesVehiculoSec = recGuiaRemision.getLineCount(ID_LIST_VEHICULO_SEC);


                for (var i = 0; i < recLinesItems; i++) {
                    var objItems = {};
                    objItems.numeroOrdenItem = (i + 1).toString();
                    var id_item = recGuiaRemision.getSublistValue({ sublistId: 'item', fieldId: "item", line: i });
                    var details_item = getDetailsItem(id_item);
                    objItems.codigoItem = details_item.codigoItem;
                    objItems.descripcionItem = recGuiaRemision.getSublistValue({ sublistId: 'item', fieldId: "description", line: i });
                    objItems.nombreItem = details_item.nombreItem;
                    objItems.cantidadItem = (recGuiaRemision.getSublistValue({ sublistId: 'item', fieldId: "quantity", line: i })).toString();
                    objItems.unidadMedidaItem = details_item.unidadMedidaItem;
                    var codigo_concepto = recGuiaRemision.getSublistValue({ sublistId: 'item', fieldId: "custcol_pe_codigo_concepto", line: i });
                    var valor_concepto = recGuiaRemision.getSublistValue({ sublistId: 'item', fieldId: "custcol_pe_valor_concepto", line: i });
                    if(codigo_concepto != '' && valor_concepto != '') {
                       objItems.infoAdicional = [{
                          "codigoConcepto": codigo_concepto,
                          "valorConcepto": valor_concepto
                       }]
                    }
                    arrItems.push(objItems);
                }


                for (var c = 0; c < recLinesConductorSec; c++) {
                    var objCondSec = {};
                    objCondSec.tipoConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_tipo_conductor", line: c });
                    objCondSec.numeroDocIdeConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_nmro_doc_identidad", line: c });
                    objCondSec.tipoDocIdeConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_tipo_doc_identidad", line: c });
                    objCondSec.nomConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_nombre_conductor", line: c });
                    objCondSec.apeConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_apellido_conductor", line: c });
                    objCondSec.numLicCondConductorSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_CONDUCTOR_SEC, fieldId: "custrecord_pe_nmro_licencia_conducir", line: c });
                    arrCondSec.push(objCondSec);
                }

                for (var v = 0; v < recLinesVehiculoSec; v++) {
                    var objVehSec = {};
                    objVehSec.numeroPlacaVehiculoSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_VEHICULO_SEC, fieldId: "custrecord_pe_nmro_placa_veh_sec", line: v });
                    objVehSec.tarjetaUnicaCircElectVehSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_VEHICULO_SEC, fieldId: "custrecord_pe_tarj_unica_circ_electronic", line: v });
                    objVehSec.entidadEmisoraAutEspVehSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_VEHICULO_SEC, fieldId: "custrecord_pe_entidad_emis_aut_especial", line: v });
                    objVehSec.numeroAutEspVehSec = recGuiaRemision.getSublistValue({ sublistId: ID_LIST_VEHICULO_SEC, fieldId: "custrecord_pe_nmro_autorizacion_especial", line: v });
                    arrVehSec.push(objVehSec);
                }

                return {
                    vehiculos_secundarios: arrVehSec,
                    conductores_secundarios: arrCondSec,
                    items: arrItems
                }


            } catch (e) {
                logError(internalId, userId, 'Error-getLinesDetails', JSON.stringify(e));
            }
        }


        function getDetailsItem(_id_item) {
            try {

                var detailsItem = search.lookupFields({
                    type: 'item',
                    id: _id_item,
                    columns: ['upccode', 'displayname', 'custitem_pe_cod_measure_unit']
                });

                return {
                    codigoItem: detailsItem.upccode,
                    nombreItem: detailsItem.displayname,
                    unidadMedidaItem: detailsItem.custitem_pe_cod_measure_unit,
                }

            } catch (e) {
                logError(internalId, userId, 'Error-getDetailsItem', JSON.stringify(e));
            }
        }


        function openCredentials(array) {
            try {
                var credentials = search.lookupFields({
                    type: 'customrecord_pe_ei_enable_features',
                    id: 1,
                    columns: ['custrecord_pe_ei_url_ws', 'custrecord_pe_ei_user', 'custrecord_pe_ei_password', 'custrecord_pe_ei_employ_copy']
                });

                return {
                    wsurl: credentials.custrecord_pe_ei_url_ws,
                    username: credentials.custrecord_pe_ei_user,
                    password: credentials.custrecord_pe_ei_password,
                    recipients: credentials.custrecord_pe_ei_employ_copy[0].value
                }
            } catch (e) {
                logError(array[0], array[1], 'Error-openCredentials', JSON.stringify(e));
            }
        }


        function sendDocument(username, password, token, url, request, array) {
            var headers1 = new Array();
            try {
                var encode64 = base64Encoded(request.request);
                var filename = request.filenameosce;
                var req = JSON.stringify({
                    "customer": {
                        "username": username,
                        "password": password
                    },
                    "fileName": filename + '.json',
                    "fileContent": encode64
                });
                headers1['Accept'] = '*/*';
                headers1['Content-Type'] = 'application/json';
                headers1['Authorization'] = token;
                var myresponse = https.post({
                    url: url,
                    body: req,
                    headers: headers1
                });

                var body = JSON.parse(myresponse.body);
                var responsecode = body.responseCode;
                var response = body.responseContent;
                var ticket = body.ticket;
                return {
                    responsecode: responsecode,
                    response: response,
                    ticket: ticket,
                    filename: filename
                }
            } catch (e) {
                logError(array[0], array[1], 'Error-sendDocument', JSON.stringify(e));
            }
        }


        function getDocumentPDF(username, password, codCPE, numSerieCPE, numCPE, token, url, array) {
            var headers1 = new Array();
            try {
                var req = JSON.stringify({
                    "user": {
                        "username": username,
                        "password": password
                    },
                    "codCPE": codCPE,
                    "numSerieCPE": numSerieCPE,
                    "numCPE": numCPE
                });
                headers1['Accept'] = '*/*';
                headers1['Content-Type'] = 'application/json';
                headers1['Authorization'] = token;
                var response = https.post({
                    url: url,
                    body: req,
                    headers: headers1
                });
                var body = JSON.parse(response.body);
                var codigo = body.codigo;
                var mensaje = body.mensaje;
                var pdf = body.pdf;

                return {
                    codigo: codigo,
                    mensaje: mensaje,
                    pdf: pdf
                }
            } catch (e) {
                logError(array[0], array[1], 'Error-getDocumentPDF', JSON.stringify(e));

            }
        }


        function getDocumentXML(username, password, codCPE, numSerieCPE, numCPE, token, url, array) {
            var headers1 = new Array();
            try {
                var req = JSON.stringify({
                    "user": {
                        "username": username,
                        "password": password
                    },
                    "codCPE": codCPE,
                    "numSerieCPE": numSerieCPE,
                    "numCPE": numCPE
                });
                headers1['Accept'] = '*/*';
                headers1['Content-Type'] = 'application/json';
                headers1['Authorization'] = token;
                var response = https.post({
                    url: url,
                    body: req,
                    headers: headers1
                });
                var body = JSON.parse(response.body);
                var mensaje = body.mensaje;
                var xml = body.xml;

                return {
                    mensaje: mensaje,
                    xml: xml
                }
            } catch (e) {
                logError(array[0], array[1], 'Error-getDocumentXML', JSON.stringify(e));
            }
        }


        function getDocumentCDR(username, password, codCPE, numSerieCPE, numCPE, token, url, array) {
            var headers1 = new Array();
            try {
                var req = JSON.stringify({
                    "user": {
                        "username": username,
                        "password": password
                    },
                    "codCPE": codCPE,
                    "numSerieCPE": numSerieCPE,
                    "numCPE": numCPE
                });
                headers1['Accept'] = '*/*';
                headers1['Content-Type'] = 'application/json';
                headers1['Authorization'] = token;
                var response = https.post({
                    url: url,
                    body: req,
                    headers: headers1
                });
                var body = JSON.parse(response.body);
                var mensaje = body.mensaje;
                var cdr = body.cdr;

                return {
                    mensaje: mensaje,
                    cdr: cdr
                }
            } catch (e) {
                logError(array[0], array[1], 'Error-getDocumentCDR', JSON.stringify(e));
            }
        }


        function generateFilePDF(namefile, content, array) {
            try {
                var fileObj = file.create({
                    name: namefile + '.pdf',
                    fileType: file.Type.PDF,
                    contents: content,
                    folder: FOLDER_PDF_GR,
                    isOnline: true
                });
                var fileid = fileObj.save();
                return fileid;
            } catch (e) {
                logError(array[0], array[1], 'Error-generateFilePDF', e.message);
            }
        }


        function generateFileXML(namefile, content, array) {
            try {
                var xml = base64Decoded(content);
                var fileObj = file.create({
                    name: namefile + '.xml',
                    fileType: file.Type.XMLDOC,
                    contents: xml,
                    folder: FOLDER_PDF_GR,
                    isOnline: true
                });
                var fileid = fileObj.save();
                return fileid;
            } catch (e) {
                logError(array[0], array[1], 'Error-generateFileXML', e.message);
            }
        }


        function generateFileCDR(namefile, content, array) {
            try {
                var cdr = base64Decoded(content);
                var fileObj = file.create({
                    name: namefile + '-CDR.xml',
                    fileType: file.Type.XMLDOC,
                    contents: cdr,
                    folder: FOLDER_PDF_GR,
                    isOnline: true
                });
                var fileid = fileObj.save();
                return fileid;
            } catch (e) {
                logError(array[0], array[1], 'Error-generateFileCDR', e.message);
            }
        }


        function generateFileJSON(namefile, content, array) {
            try {
                var fileObj = file.create({
                    name: namefile + '.json',
                    fileType: file.Type.JSON,
                    contents: content,
                    folder: FOLDER_PDF_GR,
                    isOnline: true
                });
                var fileid = fileObj.save();
                return fileid;
            } catch (e) {
                logError(array[0], array[1], 'Error-generateFileJSON', e.message);
            }
        }


        function generateFileTXT(namefile, content, array) {
            try {
                var fileObj = file.create({
                    name: namefile + '.txt',
                    fileType: file.Type.PLAINTEXT,
                    contents: content,
                    encoding: file.Encoding.UTF8,
                    folder: FOLDER_EXCEPTIONS_GR,
                    isOnline: true
                });
                var fileid = fileObj.save();
                return fileid;
            } catch (e) {
                logError(array[0], array[1], 'Error-generateFileTXT', e.message);
            }
        }


        function base64Encoded(content) {
            var base64encoded = encode.convert({
                string: content,
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });
            return base64encoded;
        }


        function base64Decoded(content) {
            var base64decoded = encode.convert({
                string: content,
                inputEncoding: encode.Encoding.BASE_64,
                outputEncoding: encode.Encoding.UTF_8
            });
            return base64decoded;
        }

        function sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }

        function random() {
            return Math.random().toString(36).substr(2); // Eliminar `0.`
        }

        function token() {
            return random() + random() + random() + random() + random(); // Para hacer el token más largo
        }


        function logStatus(internalid, docstatus) {
            try {
                var logStatus = record.create({ type: 'customrecord_pe_ei_document_status' });
                logStatus.setValue('custrecord_pe_ei_document', internalid);
                logStatus.setValue('custrecord_pe_ei_document_status', docstatus);
                logStatus.save();
            } catch (e) {

            }
        }


        function logError(internalid, userid, docstatus, response) {
            try {
                var logError = record.create({ type: 'customrecord_pe_ei_log_documents' });
                logError.setValue('custrecord_pe_ei_log_related_transaction', internalid);
                logError.setValue('custrecord_pe_ei_log_subsidiary', SUBSIDIARIA_IBERO);
                logError.setValue('custrecord_pe_ei_log_employee', userid);
                logError.setValue('custrecord_pe_ei_log_status', docstatus);
                logError.setValue('custrecord_pe_ei_log_response', response);
                logError.save();
            } catch (e) {

            }
        }


        return {
            send: send
        }
    });