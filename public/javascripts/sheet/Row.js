/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "sheet/Control",
    "sheet/Cell"], function(
        Control,
        Cell){

    var Row = Control.extend({

        init       : function(definition, settings){

            var default_settings = {

                template : "<tr></tr>",
                height   : 20,
                cells    : []
            }

            var me = this;

            this.definition = definition;
            this._super(definition, $.extend({}, default_settings, settings));

            _(this.definition.cells()).each(function(cell){
                //создаем строки на основании Definition
                me.cells.push(new Cell(cell));
            });

            $(this).bind("materialized", function(){
                //при материализиции панели заголовков материализуем Headerы
                _(me.cells).each(function(cell){
                    cell.materialize(me.view);
                });
            });
        },

        render : function(){

            //отрисовка заголовков
            _(this.cells).each(function(c){c.render()});
        }
    })

    return Row;

});