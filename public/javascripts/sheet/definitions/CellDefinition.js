/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/definitions/WidgetDefinition"
    ], function(
        WidgetDefinition){

    var CellDefinition = Class.extend({

        init       : function(settings){

            var default_settings = {
            };

            this.addSetters([
                "editable",
                "format",
                "value",
                "column",
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        },

        value : function(value){

            var val = this.setters["value"](value);
            if (typeof val == "undefined"){
                return this.inheritedValue();
            }
            return val;
        },

        inheritedWidget : function(){
            return this.column().defaultWidget();
        },

        inheritedEditable : function(){
            return this.column().editable();
        },

        inheritedValue : function(){
            return this.column().defaultValue();
        }
    });

    return CellDefinition;

});