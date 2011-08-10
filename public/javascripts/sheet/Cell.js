/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "/javascripts/sheet/Control.js",
    "/javascripts/sheet/Formatters.js"], function(Control, Formatters){

    /**
     * events
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     *  click
     */

    var default_settings = {

        template : "<td></td>",
        //флаг, указывающий на возможность редактирования
        editable : true,
        //значение, содержащееся в ячейке
        value      : "",
        //преобразователь значения ячейки в нужный вид
        formatter_type  : "to_string",
        formatter  : null,
        value_field: "value",
        width      : 0
    }

    var return_obj = Control.extend({

        init       : function(settings){

            this._super($.extend({}, default_settings, settings))
            //return_obj.formatter
            if (!return_obj.formatter){
                return_obj.formatter = Formatters[return_obj.formatter_type];
            }

        }

    })

    return return_obj;

})