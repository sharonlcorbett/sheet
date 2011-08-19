/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "sheet/Component",
    "sheet/Cell"], function(
        Component,
        Cell){

    var Row = Component.extend({

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
                    cell.materializeTo(me.view);
                });
            });
        },

        render : function(){

            var d = $.Deferred();
            var deferred = []
            _(this.cells).each(function(c){deferred.push(c.render())});
            $.when.apply(this, deferred).then(function(){
                d.resolve();
            });
            return d.promise();
        }
    })

    return Row;

});