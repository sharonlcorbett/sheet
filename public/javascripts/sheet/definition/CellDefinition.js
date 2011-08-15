/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define(["./WidgetDefinition.js"], function(WidgetDefinition){

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        editable : true,
        //значение, содержащееся в ячейке
        value      : ""
    }

    var CellDefinition = Class.extend({

        init       : function(settings){

            this.add_setters([
                "editable",
                "value",
                "format",
                "column",
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        },

        inherited_widget : function(){
            return this.column().widget();
        }
    })

    return CellDefinition;

})