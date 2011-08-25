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

            this.parent(options)
        },

        render : function(){

            this.widget.render();
        },

        applyDefinition: function(def){

            this.parent(def);
            this.widget.value = this.definition.value();

            this.definition.watchFields({
                value : function(field, value){
                    this.widget.value = value;
                    this.widget.render();
                }.bind(this)
            });
        }

    })

    return Cell;

})