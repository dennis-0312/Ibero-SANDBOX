<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>

    <head>
        <meta name="title" value="Guía de Remisión Electronica - Remitente"/>
        <link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
        <#if .locale == "zh_CN">
            <link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
            <#elseif .locale == "zh_TW">
            <link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
            <#elseif .locale == "ja_JP">
            <link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
            <#elseif .locale == "ko_KR">
            <link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
            <#elseif .locale == "th_TH">
            <link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
        </#if>
        <macrolist>
             <macro id="nlheader">
            </macro>
            <macro id="nlfooter">
                <table class="footer">
                    <tr>
                       <!--  <td align="center" colspan="2" style="font-size: 8px;"><p style="text-align: center">Autorizado mediante resolucion Nro. 0340050010017/SUNAT. Para consultar el comprobante ingresar a https://escondatagate.page.link/gpXgK. Representacion impresa del Comprobante Electronico.</p></td>-->
                        <td align="center" style="font-size: 12px; margin-left:440pt "> 
                            Página <pagenumber /> de <totalpages />
                        </td>
                    </tr>
                    
                </table> 
            </macro>
        </macrolist>
        <style type="text/css">
            * {
                <#if .locale=="zh_CN">font-family: NotoSans, NotoSansCJKsc, sans-serif;
                <#elseif .locale=="zh_TW">font-family: NotoSans, NotoSansCJKtc, sans-serif;
                <#elseif .locale=="ja_JP">font-family: NotoSans, NotoSansCJKjp, sans-serif;
                <#elseif .locale=="ko_KR">font-family: NotoSans, NotoSansCJKkr, sans-serif;
                <#elseif .locale=="th_TH">font-family: NotoSans, NotoSansThai, sans-serif;
                <#else>font-family: NotoSans, sans-serif;
                </#if>
            }

            table {
                font-size: 9pt;
                table-layout: fixed;
            }

            th {
                font-weight: bold;
                font-size: 8pt;
                vertical-align: middle;
                padding: 5px 6px 3px;
                background-color: #333333;
                color: #333333;
            }

            td {
                padding: 4px 6px;
            }

            td p {
                align: left
            }

            b {
                font-weight: bold;
                color: #333333;
            }

            table.header td {
                padding: 0;
                font-size: 10pt;
            }

            table.footer td {
                padding: 0;
                font-size: 8pt;
            }

            table.itemtable th {
                padding-bottom: 10px;
                padding-top: 10px;
            }

            table.body td {
                padding-top: 2px;
            }

            table.total {
                page-break-inside: avoid;
            }

            tr.totalrow {
                background-color: #333333;
                line-height: 200%;
            }


            tr.totalrow2 {
                line-height: 100%;
            }

            td.totalboxtop {
                font-size: 12pt;
                background-color: #333333;
            }

            td.addressheader {
                font-size: 8pt;
                padding-top: 6px;
                padding-bottom: 2px;
            }

            td.address {
                padding-top: 0;
            }

            td.totalboxmid {
                font-size: 28pt;
                padding-top: 20px;
                background-color: #333333;
            }

            td.totalboxbot {
                background-color: #333333;
                font-weight: bold;
            }

            span.title {
                font-size: 18pt;
            }

            span.number {
                font-size: 16pt;
            }

            span.itemname {
                font-weight: bold;
                line-height: 150%;
            }

            hr {
                width: 100%;
                color: #333333;
                background-color: #333333;
                height: 1px;
            }

            .bordes {
                border: 0.1px solid #333333;
                /* border-collapse: collapse; */
            }

            .border {
                border-right: 0.1px solid #000;
                border-left: 0.1px solid #000;
            }

            .borderbottom {
                border-bottom: 0.1px solid #333333;
            }

            .separador {
                width: 5px;
            }

            .fontwhite {
                color: #fff;
            }

            .fondowhite {
                background-color: #fff;
            }

            .coloremaiil {
                color: #0883db;
            }

            .textalign {
                text-justify: none;
            }
            .content {
                min-height: 500px;
            }
        </style>
    </head>

    <body footer="nlfooter" footer-height="3.5em" padding="0.5in 0.5in 0.5in 0.5in" size="A4">
        <div>
            <table style="float: left; width: 50%;">
                <tr>
                    <td>
                        <#if companyInformation.logoUrl?length !=0>
                            <@filecabinet nstype="image" src="${companyInformation.logoUrl}"
                                style="float: left; width: 312px; height: 52px;" />
                        </#if>
                    </td>
                </tr>
                <tr><td align="center" style="font-size: 14px; padding: 4px 0; line-height: 60%">${record.legalname}</td></tr>
                <tr><td align="center" style="font-size: 8px; padding: 4px 0; line-height: 60%">${record.addr1}</td></tr>
                <tr><td align="center" style="font-size: 8px; padding: 4px 0; line-height: 60%">${record.addr2}</td></tr>
                <tr><td align="center" style="font-size: 8px; padding: 4px 0; line-height: 60%">Telefax: ${record.telefax}</td></tr>
                <tr><td align="center" style="font-size: 8px; padding: 4px 0; line-height: 60%">Web: ${record.url}</td>
                </tr>
            </table>
            <table style="float: right; width: 50%; border: 1px solid #333333; margin-left:110pt">
                <tr><td align="center"></td></tr>
                <tr><td align="center"></td></tr>
                <tr><td align="center">R.U.C: ${record.federalidnumber}</td></tr>
                <tr><td align="center">Guía de remisión</td></tr>
                <tr><td align="center">Electrónica - Remitente</td></tr>
                <tr><td align="center">${record.numeracion}</td></tr>
                <tr><td align="center"></td></tr>
            </table>
        </div>
        <table style="width: 100%;">
            <tr>
                <td colspan="3"></td>
                <td align="center" style="border: 1px solid black; font-size: 8px; text-align: center;">
                    <strong>Fecha de Emisión: ${record.trandate}</strong>
                </td>
            </tr>
        </table>
        <table class="bordes" style="width: 100%;">
            <tr>
                <td class="fondo"><strong>Destinatario: </strong></td>
                <td class="row" colspan="3">${record.entity}</td>
                <td class="fondo"><strong>Descuento: </strong></td>
                <td class="row" colspan="2">${record.sumaDscto}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>RUC: </strong></td>
                <td class="row" colspan="3">${record.vatregnum}</td>
                <td class="fondo"><strong>N° Pedido: </strong></td>
                <td class="row" colspan="2">${record.internalid}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Direccion: </strong></td>
                <td class="row" colspan="3">${record.customer_direccion}</td>
                <td class="fondo"><strong>N° Remision: </strong></td>
                <td class="row" colspan="2">${record.numeracion}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Ciudad: </strong></td>
                <td class="row" colspan="3">${record.customer_city}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Motivo de Traslado: </strong></td>
                <td class="row" colspan="3">${record.motivoTraslado}</td>
            </tr>
        </table>
        <#if record.item?has_content>
            <div style="width:100%; display: flex; margin-top: 10px">
                <table  style="width: 100%; height: 60vh">
                    <#list record.item as item>
                        <#if item_index==0>
                            <thead>
                                <tr>
                                    <th align="center" class="bordes fondowhite" colspan="1" style="font-size: 8px">Nro</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">Código</th>
                                    <th align="center" class="bordes fondowhite" colspan="4" style="font-size: 8px">EAN</th>
                                    <th align="center" class="bordes fondowhite" colspan="10" style="font-size: 8px">Descripción</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">Cant</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">Valor &nbsp; Unitario</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">IGV</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">PVP</th>
                                    <th align="center" class="bordes fondowhite" colspan="2" style="font-size: 8px">Valor&nbsp;de&nbsp; Venta</th>
                                </tr>
                            </thead>
                        </#if>
                        <tr>
                            <td align="center" class="border" colspan="1" style="font-size: 8px">${item?counter}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.upc}</td>
                            <td align="center" class="border" colspan="4" style="font-size: 8px">${item.item}</td>
                            <td align="left" class="border" colspan="10" style="font-size: 8px">${item.description}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.quantity}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.preciounitario}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.taxamount}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.pvp}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${item.total}</td>
                        </tr>
                    </#list>
                        <tr>
                            <td align="center" class="border" colspan="1" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="4" style="font-size: 8px"></td>
                            <td align="left" class="border" colspan="10" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                        </tr>
                        <tr>
                            <td align="center" class="border" colspan="1" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="4" style="font-size: 8px"></td>
                            <td align="left" class="border" colspan="10" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                        </tr>
                        <tr>
                            <td align="center" class="border" colspan="1" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="4" style="font-size: 8px"></td>
                            <td align="left" class="border" colspan="10" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                        </tr>
                        
                        <tr style="border-bottom: 0.1px solid #333333">
                            <td align="center" class="border" colspan="1" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="4" style="font-size: 8px"></td>
                            <td align="left" class="border" colspan="10" style="font-size: 8px"><strong>Tot Unidades:</strong></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px">${record.unidades}</td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                            <td align="center" class="border" colspan="2" style="font-size: 8px"></td>
                        </tr>
                </table>
            </div>
        </#if>
                <table style="width: 100%; margin-top: 15px">
                    <tr>
                        <td class="fondo" style="font-size: 10px"><strong>Punto de Partida: </strong></td>
                        <td class="row" colspan="6" style="font-size: 10px">${record.direccionPuntoPartida}</td>
                        <td align="left" class="fondo" style="font-size: 10px"><strong>Subtotal: </strong></td>
                        <td align="right" class="row" colspan="1" style="font-size: 10px">${record.subtotal}</td>
                    </tr>
                    <tr>
                        <td class="fondo" style="font-size: 10px"></td>
                        <td class="row" colspan="6" style="font-size: 10px"></td>
                        <td align="left" class="fondo" style="font-size: 10px"><strong>Descuento: </strong></td>
                        <td align="right" class="row" colspan="1" style="font-size: 10px">${record.sumaDscto}</td>
                    </tr>
                    <tr>
                        <td class="fondo" style="font-size: 10px"><strong>Punto de Llegada: </strong></td>
                        <td class="row" colspan="6" style="font-size: 10px">${record.direccionPuntoLlegada}</td>
                        <td align="left" class="fondo" style="font-size: 10px"><strong>TOTAL DE EMISION: </strong></td>
                        <td align="right" class="row" colspan="1" style="font-size: 10px">${record.totalEmision}</td>
                    </tr>
                </table>
            <div>
                <table width="100%" style="width: 100%; margin-top: 10px">
                    <tr>
                        <td align="left" width="27%" class="border" style="font-size: 8px; border-top: 0.1px solid #333333">Observaciones:</td>
                        <td rowspan="5" width="27%" align="left" class="bordes" style="font-size: 8px">Datos del transportista:</td>
                        <td width="27%" align="left" class="border" style="font-size: 8px; border-top: 0.1px solid #000">V°B°Almacen:</td>
                        <td rowspan="5" align="left" style="font-size: 8px" ><barcode codetype="qrcode" showtext="true" value="${record.tranid}" width="104" height="91"/></td>
                    </tr>
                    <tr>
                        <td class="border" style="font-size: 8px">${record.memo}</td>
                        <td class="border" style="font-size: 8px"></td>
                    </tr>
                    <tr>
                        <td align="left" class="border" style="font-size: 8px">Almacen: ${record.location}</td>
                        <td class="border" style="border-top: 0.1px solid #000; font-size: 8px">Recibí Conforme: </td>
                    </tr>
                    <tr>
                        <td align="left" class="border" style="font-size: 8px">Agente: ${record.agente}</td>
                        <td class="border" style="font-size: 8px"></td>
                    </tr>
                    <tr>
                        <td align="left" class="border" style="font-size: 8px; border-bottom: 0.1px solid #333333">Peso Bruto Total de la Guía KGM: ${record.peso_bruto}</td>
                        <td class="border" style="font-size: 8px; border-bottom: 0.1px solid #333333"></td>
                    </tr>
                </table>

            </div>
            <div>
                <table width="100%" style="width: 100%; margin-top: 10px">
                    <tr>
                        <td align="center" colspan="2" style="font-size: 8px;"><p style="text-align: center">Autorizado mediante resolucion Nro. 0340050010017/SUNAT. Para consultar el comprobante ingresar a https://escondatagate.page.link/gpXgK. Representacion impresa del Comprobante Electronico.</p></td>
                    </tr>
                </table>
            </div>
    </body>
</pdf>