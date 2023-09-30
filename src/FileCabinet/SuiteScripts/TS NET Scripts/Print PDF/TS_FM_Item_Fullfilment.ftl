<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>

    <head>
        <meta name="title" value="Ejecución de Pedido"/>
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
                <table class="header" style="width: 100%;">
                    <tr>
                        <td rowspan="3" style="width: 222px; height: 60px;">
                            <#if companyInformation.logoUrl?length !=0>
                                <@filecabinet nstype="image" src="${companyInformation.logoUrl}"
                                    style="float: left; width: 180px; height: 30px;" />
                            </#if>
                        </td>
                        <!-- <td align="right" style="width: 582px; font-size: 10px; height: 31px;">
                            ${companyInformation.companyName}</td> -->
                        <td align="right">
                            <pagenumber /> de
                            <totalpages />
                        </td>
                    </tr>
                    <!-- <tr>
                        <td align="right" style="width: 582px;"><span style="font-size:18px;">${record.vatregnum}</span>
                        </td>
                    </tr> -->
                    <tr style="margin-top: 20px;">
                        <td align="left" style="width: 528px; font-size: 20px; padding-left:40px;">Ejecución de Pedido</td>
                    </tr>
                </table>
            </macro>
            <macro id="nlfooter">
            <!--
                <table class="footer" style="width: 100%;">
                    <tr>
                        <td>
                            <barcode codetype="code128" showtext="true" value="${record.tranid}" />
                        </td>
                    </tr>
                </table> -->
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

            .fondo {
                /* background-color: #e3e3e3; */
                padding: 10px;
            }

            .row {
                padding: 10px;
            }

            .bordes {
                border: 0.1px solid #333333;
                /* border-collapse: collapse; */
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
        </style>
    </head>

    <body header="nlheader" header-height="8.7%" footer="nlfooter" footer-height="20pt"
        padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
        <table class="bordes" style="width: 100%;">
            <tr>
                <td class="fondo"><strong>Nro de Orden</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.tranid}</td>
                <td class="fondo">&nbsp;</td>
                <td class="fondo separador">&nbsp;</td>
                <td class="row" colspan="2">&nbsp;</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Receptor</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="6">${record.vatregnum} ${record.entity}</td>
                <!-- <td class="fondo"><strong>&nbsp;</strong></td> -->
                <!-- <td class="fondo separador">&nbsp;</td>
                <td class="row" colspan="2">&nbsp;</td> -->
            </tr>
            <tr>
                <td class="fondo"><strong>Fecha de Emisión</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.trandate}</td>
                <td class="fondo"><strong>Fecha de Entrega</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.duedate}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Lugar de Tienda</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.location}</td>
                <td class="fondo"><strong>Dirección</strong></td>
                <td class="fondo">:</td>
                <td class="row" colspan="2">${record.shipaddr1}&nbsp;-&nbsp;${record.shipaddr2}</td>
            </tr>
            <tr>
                <td class="fondo" colspan="4">&nbsp;</td>
                <td class="fondo"><strong>Ciudad</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.shipcity}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Moneda</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.currencyname}</td>
                <td class="fondo"><strong>Quien lo recibe</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.quienrecibe}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Entidad a Facturar</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.federalidnumber}&nbsp;${record.legalname}</td>
                <td class="fondo"><strong>Dirección de Facturación</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">${record.addr1}&nbsp;${record.mainaddress.addr2}</td>
            </tr>
            <tr>
                <td class="fondo"><strong>Correo de Facturación</strong></td>
                <td class="fondo separador">:</td>
                <td class="row coloremaiil" colspan="2">${record.email}</td>
                <td class="fondo"><strong>Ciudad</strong></td>
                <td class="fondo separador">:</td>
                <td class="row" colspan="2">&nbsp;&nbsp;${record.addr3}</td>
            </tr>
        </table>
        <#if record.item?has_content>

            <table class="bordes" style="width: 100%; margin-top: 10px;">
                <#list record.item as item>
                    <#if item_index==0>
                        <thead>
                            <tr>
                                <th align="center" class="bordes fondowhite" colspan="1">#</th>
                                <th align="left" class="bordes fondowhite" colspan="6">CÓDIGO</th>
                                <th align="center" class="bordes fondowhite" colspan="12">DESCRIPCIÓN</th>
                                <th align="center" class="bordes fondowhite" colspan="2">CANT</th>
                                <th align="center" class="bordes fondowhite" colspan="3">UNIDAD</th>
                                <th align="center" class="bordes fondowhite" colspan="3">TOTAL</th>
                            </tr>
                        </thead>
                    </#if>
                    <tr>
                        <td align="center" class="bordes" colspan="1">${item?counter}</td>
                        <td class="bordes" colspan="6"><span class="itemname">${item.item}</span></td>
                        <td align="left" class="bordes" colspan="12">${item.description}</td>
                        <td align="center" class="bordes" colspan="2">${item.quantity}</td>
                        <td align="center" class="bordes" colspan="3">${item.units}</td>
                        <td align="center" class="bordes" colspan="3">${item.total}</td>
                    </tr>
                </#list>
            </table>
        </#if>

        <!--
        <#if record.expense?has_content>

            <table class="itemtable" style="width: 100%;">
                <#list record.expense as expense>
                    <#if expense_index==0>
                        <thead>
                            <tr>
                                <th align="center" class="bordes fondowhite" colspan="1">#</th>
                                <th align="left" class="bordes fondowhite" colspan="6">Categoría</th>
                                <th align="left" class="bordes fondowhite" colspan="6">Nota</th>
                                <th align="right" class="bordes fondowhite" colspan="4">Monto Neto</th>
                                <th align="right" class="bordes fondowhite" colspan="4">Impuesto</th>
                                <th class="bordes fondowhite" colspan="4" style="text-align: right;">
                                    Total&nbsp;con<br />Impuestos</th>
                            </tr>
                        </thead>
                    </#if>
                    <tr>
                        <td align="center" class="bordes" colspan="1">${expense?counter}</td>
                        <td class="bordes" colspan="6"><span>${expense.category}</span></td>
                        <td class="bordes" colspan="6"><span>${expense.memo}</span></td>
                        <td align="right" class="bordes" colspan="4">${expense.amount?html?replace('PEN','')}</td>
                        <td align="right" class="bordes" colspan="4">${expense.tax1amt?html?replace('PEN','')}</td>
                        <td align="right" class="bordes" colspan="4">${expense.grossamt?html?replace('PEN','')}</td>
                    </tr>
                </#list>
            </table>
        </#if>

        <hr />
        
        <table class="total" style="width: 100%;">
            <tr class="totalrow2">
                <td colspan="4">&nbsp;</td>
                <td align="right" class="bordes fondowhite"><b>Subtotal</b></td>
                <td align="right" class="bordes fondowhite">${record.subtotal?html?replace('PEN','')}</td>
            </tr>
            <tr class="totalrow2">
                <td colspan="4">&nbsp;</td>
                <td align="right" class="bordes fondowhite"><b>Tax Total(18%)</b></td>
                <td align="right" class="bordes fondowhite">${record.taxtotal?html?replace('PEN','')}</td>
            </tr>
            <tr class="totalrow2">
                <td background-color="#ffffff" colspan="4">&nbsp;</td>
                <td align="right" class="bordes fondowhite"><b>Total</b></td>
                <td align="right" class="bordes fondowhite">${record.total?html?replace('PEN','')}</td>
            </tr>
        </table>
        -->
    </body>
</pdf>