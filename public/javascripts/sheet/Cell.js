/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/WidgetComponent",
    "sheet/Formatters"
    ], function(
        WidgetComponent,
        Formatters){

    /**
     * events
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     *  click
     */

    var Cell = WidgetComponent.extend({

        init       : function(definition, settings){

            var default_settings = {
                template : "<td></td>"
            }

            this.definition = definition;
            this._super(definition, $.extend({}, default_settings, settings));

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