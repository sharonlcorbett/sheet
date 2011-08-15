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


    var default_settings = {

        template : "<td></td>"
    }

    var Cell = Control.extend({

        init       : function(definition, settings){

            this.definition = definition;
            this._super(definition, $.extend({}, default_settings, settings));
        }

    })

    return Cell;

})