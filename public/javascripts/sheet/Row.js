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

    var Row = new Class({

        Extends : Component,

        options : {

            elementTag : 'tr'
        },

        cells : [],

        initialize : function(options){

            var me = this;
            this.parent(options);
        },

        applyDefinition : function(def){

            var me = this;
            this.parent(def);
            def.cells().each(function(cell){
                //создаем строки на основании Definition
                var c = new Cell();
                c.applyDefinition(cell);
                me.cells.push(c);
            })
        },

        inject : function(element){

            var me = this;
            this.parent(element);
            this.cells.each(function(cell){
                cell.inject(me.view);
            });
        },

        render : function(){

            this.cells.each(function(cell){
                cell.render();
            });
            this.fireEvent('rendered');
        }
    })

    return Row;

});