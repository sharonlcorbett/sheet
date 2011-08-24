/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/WidgetComponent"
    ], function(
        WidgetComponent){

    /**
     * events
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     *  click
     */

    var Cell = new Class({

        Extends : WidgetComponent,

        options : {

            elementTag: 'td'
        },

        initialize       : function(options){

            this.parent(options);

            var me = this;

            /*$(this.definition).bind("setter", function(e, name, val){

                switch(name){

                    case "value":
                        if (me.widgetLoading.isResolved()){
                            me.widget.value(val);
                        }
                    break;
                }
            })*/
        }
    })

    return Cell;

})