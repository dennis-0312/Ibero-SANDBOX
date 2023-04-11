<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>

    <head>
        <meta name="title" value="Ejecución de Pedido Electrónico"/>
        <link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
        <#--  <#if .locale == "zh_CN">
            <link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
            <#elseif .locale == "zh_TW">
            <link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
            <#elseif .locale == "ja_JP">
            <link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
            <#elseif .locale == "ko_KR">
            <link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
            <#elseif .locale == "th_TH">
            <link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
        </#if>  -->
        <macrolist>
            <macro id="nlheader">
                <table style="float: left; width: 50%;">
                    <tr>
                        <td>
                            <#--  <#if companyInformation.logoUrl?length !=0>
                                <@filecabinet nstype="image" src="${companyInformation.logoUrl}"
                                style="float: left; width: 120px; height: 50px;" />
                            </#if>  -->
                            <#if companyInformation.logoUrl?length !=0>
                                <@filecabinet nstype="image" src="https://6785603-sb1.app.netsuite.com/core/media/media.nl?id=37850&c=6785603_SB1&h=enj1E8NNjmxgHVcdnv9ZhRtMqaeFHBnMIhMnNzd-Ul4V3DWh"
                                style="float: left; width: 120px; height: 100px;" />
                            </#if>
                        </td>
                    </tr>
                    <tr><td style="font-size: 14px"> ${record.razonSocialEmi}</td></tr>
                    <tr><td style="font-size: 8px">${record.addressLocation}</td></tr>
                    <tr><td style="font-size: 8px">${record.direccionEmi}</td></tr>
                    <tr><td style="font-size: 8px">Teléfono: ${record.telefonoEmi}</td></tr>
                    <tr><td style="font-size: 8px">Correo: ${record.correoElectronicoEmi}</td></tr>
                </table>
                <table style="float: right; width: 50%; border: 1px solid #333333; margin-left:110pt">
                    <tr><td align="center"></td></tr>
                    <tr><td align="center"></td></tr>
                    <tr><td align="center">RUC N° ${record.federalidnumber}</td></tr>
                    <tr><td align="center">GUÍA DE REMISIÓN</td></tr>
                    <tr><td align="center">${record.numeracion}</td></tr>
                    <tr><td align="center"></td></tr>
                </table>
            </macro>
            <macro id="nlfooter">
            <table class="footer">
                <tr style="border-bottom: 0.5px solid black">
                    <td><barcode codetype="qrcode" showtext="true" value="${record.tranid}" width="80" height="70"/></td>
                    <td style="font-size: 10px; vertical-align: middle;"><b>Fecha y Hora de Autorización: </b>${record.trandate} ${record.horaEmision}</td>
                </tr>
                <tr>
                    <td align="center" colspan="2" style="font-size: 8px;"><p style="text-align: center">Autorizado mediante resolucion Nro. 0340050010017/SUNAT. 
                    Para consultar el comprobante ingresar a https://escondatagate.page.link/gpXgK. Representacion impresa del Comprobante Electronico.</p></td>
                </tr>
            </table> 
            </macro>
        </macrolist>
        <style type="text/css">
            * {
                /*<#if .locale=="zh_CN">font-family: NotoSans, NotoSansCJKsc, sans-serif;
                <#elseif .locale=="zh_TW">font-family: NotoSans, NotoSansCJKtc, sans-serif;
                <#elseif .locale=="ja_JP">font-family: NotoSans, NotoSansCJKjp, sans-serif;
                <#elseif .locale=="ko_KR">font-family: NotoSans, NotoSansCJKkr, sans-serif;
                <#elseif .locale=="th_TH">font-family: NotoSans, NotoSansThai, sans-serif;
                <#else>font-family: NotoSans, sans-serif;
                </#if>*/
                font-family: 'Times New Roman', Times, serif;           
            }


            .miTabla {
                border: 1px solid #333333;
                width: 100%;
                font-size: 9pt;
                table-layout: fixed;
                margin-bottom: 20px;
            }

        </style>
    </head>

    <body header="nlheader" header-height="20%" footer="nlfooter" footer-height="6.5em"
    padding="0.5in 0.5in 0.5in 0.5in" size="A4">
    <#--  <table>
        <tr><td align="right" style="font-size: 18pt">RUC: ${record.federalidnumber}</td></tr>
        <tr><td align="right" style="font-size: 18pt"><b>GUÍA DE REMISIÓN ELECTRÓNICA</b></td></tr>
        <tr><td align="right" style="font-size: 18pt; color: #D94F31;">${record.numeracion}</td></tr>
    </table>  -->

    <#--  <table>
        <tr>
            <td><b>Destinatario:</b></td>
            <td colspan="3">${record.legalname}</td>
        </tr>
        <tr>
            <td><b>Dirección:</b></td>
            <td colspan="3">${record.direccion} </td>
        </tr>
        <tr>
            <td><b>RUC:</b></td>
            <td>${record.numeroDocId} </td>
            <td><b>Fecha Emisión:</b></td>
            <td>${record.trandate}</td>
        </tr>
        <tr>
            <td><b>Fecha de Traslado:</b></td>
            <td>${record.fechaInicioTraslado}</td>
            <td><b>Motivo de Traslado:</b></td>
            <td>${record.motivoTraslado}</td>
        </tr>
        <tr>
            <td><b>Punto de Partida:</b></td>
            <td colspan="3">${record.ubigeoPuntoPartida}</td>
        </tr>
        <tr>
            <td><b>Punto de Llegada:</b></td>
            <td colspan="3">${record.ubigeoPuntoLlegada}</td>
        </tr>
        <tr>
            <td><b>Transportista:</b></td>
            <td>${record.nomConductor} ${record.apeConductor}</td>
            <td><b>Identificación:</b></td>
            <td>${record.numeroDocIdeConductor}</td>
        </tr>
        <tr>
            <td><b>Licencia de Conducir:</b></td>
            <td>${record.numLicCondConductor}</td>
            <td><b>Placa del Vehículo:</b></td>
            <td>${record.numeroPlacaVehiculo}</td>
        </tr>
    </table>  -->

    <table class="miTabla">
        <tr>
            <td colspan="4"><b>DATOS DEL DOCUMENTO</b></td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>Numeración:</b> ${record.numeracion}</td>
            <td><b>Fecha Emisión:</b> ${record.fechaEmision}</td>
            <td><b>Hora Emisión:</b> ${record.horaEmision}</td>
            <td><b>Código Documento:</b> ${record.codTipoDocumento}</td>
        </tr>
        <tr>
            <td colspan="4"><b>EMISOR</b></td>
        </tr>
        <tr>
            <td><b>Tipo Doc:</b> ${record.tipoDocIdEmi}</td>
            <td><b>Nro Doc:</b> ${record.numeroDocIdEmi}</td>
            <td><b>Nombre Comercial:</b> ${record.nombreComercialEmi}</td>
            <td><b>Razón Social:</b> ${record.razonSocialEmi}</td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>Dirección:</b> ${record.direccionEmi}</td>
            <td><b>Código Postal:</b> ${record.codigoPaisEmi}</td>
            <td><b>Telefóno:</b> ${record.telefonoEmi}</td>
            <td><b>Email:</b> ${record.correoElectronicoEmi}</td>
        </tr>
        <tr>
            <td colspan="4"><b>RECEPTOR</b></td>
        </tr>
        <tr>
            <td><b>Tipo Doc:</b> ${record.tipoDocId}</td>
            <td><b>Nro Doc:</b> ${record.numeroDocId}</td>
            <td><b>Razón Social:</b> ${record.razonSocial}</td>
            <td><b>Dirección:</b> ${record.direccion}</td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td colspan="2"><b>Telefóno:</b> ${record.telefono}</td>
            <td colspan="2"><b>Email:</b> ${record.correoElectronico}</td>
        </tr>
        <tr>
            <td colspan="4"><b>INFORMACIÓN DEL TRASLADO</b></td>
        </tr>
        <tr>
            <td><b>Id Traslado:</b> ${record.idTraslado}</td>
            <td><b>Motivo Traslado:</b> ${record.motivoTraslado}</td>
            <td><b>Descripción Traslado:</b> ${record.descripcionMotivoTraslado}</td>
            <td><b>Peso Bruto:</b> ${record.pesoBrutoBienes}</td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>Unidad Medida:</b> ${record.unidadMedidaPesoBruto}</td>
            <td colspan="2"><b>Modalidad Traslado:</b> ${record.modalidadTraslado}</td>
            <td><b>Fecha Inicio Traslado:</b> ${record.fechaInicioTraslado}</td>
        </tr>
        <tr>
            <td colspan="4"><b>TRANSPORTE PÚBLICO</b></td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>RUC Transportista:</b> ${record.numeroRucTransportista}</td>
            <td><b>Tipo Doc Transportista:</b> ${record.tipoDocTransportista}</td>
            <td colspan="2"><b>Denominación Transportador:</b> ${record.denominacionTransportador}</td>
        </tr>
        <tr>
            <td colspan="4"><b>TRANSPORTE PRIVADO</b></td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>Placa Vehículo:</b> ${record.numeroPlacaVehiculo}</td>
            <td colspan="2"><b>Nro Doc Conductor:</b> ${record.numeroDocIdeConductor}</td>
            <td><b>Tipo Doc Conductor:</b> ${record.tipoDocIdeConductor}</td>
        </tr>
        <tr style="border-bottom: 0.5px dashed black">
            <td><b>Ubigeo Punto Llegada:</b> ${record.ubigeoPuntoLlegada}</td>
            <td><b>Dirección Punto Llegada:</b> ${record.direccionPuntoLlegada}</td>
            <td><b>Ubigeo Punto Partida:</b> ${record.ubigeoPuntoPartida}</td>
            <td><b>Dirección Punto Partida:</b> ${record.direccionPuntoPartida}</td>
        </tr>
        <tr>
            <td colspan="4"><b>INFORMACIÓN CONDUCTOR</b></td>
        </tr>
        <tr>
            <td><b>Tipo Conductor</b> ${record.tipoConductor}</td>
            <td><b>Nombre Conductor:</b> ${record.nomConductor}</td>
            <td><b>Apellido Conductor:</b> ${record.apeConductor}</td>
            <td><b>Licencia Conductor:</b> ${record.numLicCondConductor}</td>
        </tr>
    </table>

    <#if record.item?has_content>
            <table class="miTabla">
                <#list record.item as item>
                    <#if item_index==0>
                        <thead>
                            <tr style="border-bottom: 0.5px solid black">
                                <th align="left" style="width: 15%;"><b>CÓDIGO</b></th>
                                <th align="center" style="width: 5%;"><b>UM</b></th>
                                <th align="center" style="width: 20%;"><b>NOMBRE</b></th>
                                <th align="center" style="width: 30%;"><b>DESCRIPCIÓN</b></th>
                                <th align="center" style="width: 20%;"><b>CANT.</b></th>
                                <th align="center" style="width: 10%;"><b>PRECIO</b></th>
                            </tr>
                        </thead>
                    </#if>
                    <tr>
                        <td align="left" style="width: 15%;"><span class="itemname">${item.item}</span></td>
                        <td align="center" style="width: 5%;">${item.units}</td>
                        <td align="center" style="width: 20%;">${item.upc}</td>
                        <td align="center" style="width: 30%;">${item.description}</td>
                        <td align="center" style="width: 20%;">${item.quantity}</td>
                        <td align="center" style="width: 10%;">${item.total}</td>
                    </tr>
                </#list>
            </table>
    </#if>

    <#--  <table>
        <tr>
            <td><b>Transportista:</b></td>
            <td colspan="5">${record.nomConductor} ${record.apeConductor}</td>
        </tr>
        <tr>
            <td><b>Identificación:</b></td>
            <td>${record.numeroDocIdeConductor}</td>
            <td><b>Licencia de Conducir:</b></td>
            <td>${record.numLicCondConductor}</td>
            <td><b>Placa del Vehículo:</b></td>
            <td>${record.numeroPlacaVehiculo}</td>
        </tr>
    </table>  -->

    </body>
</pdf>