/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    function onRequest(context) {
        try {

            if (context.request.method === 'GET') {

                var form = serverWidget.createForm('Detalle de artículos');

                form.addFieldGroup({ id: 'groupInfoLibro', label: 'Información del libro' });
                var f_autor = form.addField({ id: 'custpage_autor', type: 'text', label: 'Autor', container: 'groupInfoLibro' });
                var f_editorial = form.addField({ id: 'custpage_editorial', type: 'text', label: 'Editorial', container: 'groupInfoLibro' });
                var f_categoria = form.addField({ id: 'custpage_categoria', type: 'text', label: 'Categoria', container: 'groupInfoLibro' });
                var f_subcategoria = form.addField({ id: 'custpage_subcategoria', type: 'text', label: 'Sub-Categoria', container: 'groupInfoLibro' });


                var sublist1 = form.addSublist({ id: 'sublist1', type: serverWidget.SublistType.LIST, label: 'Stock de los artículos' });
                sublist1.addField({ id: 'list1_ubicacion', type: serverWidget.FieldType.TEXT, label: 'Ubicación' });
                sublist1.addField({ id: 'list1_cantidad_fisica', type: serverWidget.FieldType.TEXT, label: 'Cantidad Física' });
                sublist1.addField({ id: 'list1_cantidad_fisica_ub', type: serverWidget.FieldType.TEXT, label: 'Cantidad Física (Unidad Base)' });
                sublist1.addField({ id: 'list1_costo_promedio', type: serverWidget.FieldType.TEXT, label: 'Costo Promedio' });
                sublist1.addField({ id: 'list1_punto_reorden', type: serverWidget.FieldType.TEXT, label: 'Punto de Reorden' });
                sublist1.addField({ id: 'list1_nivel_stock_optimo', type: serverWidget.FieldType.TEXT, label: 'Nivel de Stock Óptimo' });
                sublist1.addField({ id: 'list1_costo_predet_devolucion', type: serverWidget.FieldType.TEXT, label: 'Costo Predeterminado de Devolución' });
                sublist1.addField({ id: 'list1_cant_segun_orden', type: serverWidget.FieldType.TEXT, label: 'Cantidad según orden' });
                sublist1.addField({ id: 'list1_cant_confirmada', type: serverWidget.FieldType.TEXT, label: 'Cantidad Confirmada' });
                sublist1.addField({ id: 'list1_cant_disp_venta', type: serverWidget.FieldType.TEXT, label: 'Cantidad disponible para venta' });
                sublist1.addField({ id: 'list1_cant_disp_venta_ub', type: serverWidget.FieldType.TEXT, label: 'Cantidad disponible para venta (Unidad Base)' });


                context.response.writePage(form);

            }

        } catch (e) {
            log.error('Error en onRequest', e);
        }
    }

    return {
        onRequest: onRequest
    }
});
