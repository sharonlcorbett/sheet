/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define(["./Widget.js"], function(Widget){

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        editable : true,
        //значение, содержащееся в ячейке
        value      : ""
    }

    var Cell = Class.extend({

        init       : function(settings){

            this.add_setters([
                "editable",
                "value",
                "format",
                ["widget", Widget]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    })

    return Cell;

})