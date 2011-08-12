/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "./WidgetControl.js",
    "./Formatters.js"], function(Control, Formatters){

    /**
     * events
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     *  click
     */

    var pv = {};

    var default_settings = {

        template : "<td></td>",
        //флаг, указывающий на возможность редактирования
        editable : true,
        //значение, содержащееся в ячейке
        value      : "",
        //преобразователь значения ячейки в нужный вид
        formatter_type  : "to_string"
    }

    var Cell = Control.extend({

        init       : function(settings){

            this.add_setters([
                "formatter",
                "editable"
            ], pv);

            this._super($.extend({}, default_settings, settings));

            //return_obj.formatter
            if (typeof this.formatter() != "function"){
                this.formatter(Formatters[this.formatter_type]);
            }

        }
    })

    return Cell;

})