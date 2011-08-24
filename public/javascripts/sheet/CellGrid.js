define([
    "sheet/Component",
    "sheet/Row"], function(
        Component,
        Row){

    var CellGrid = new Class({

        Extends : Component,

        options : {

            elementTemplate: function(){
                div({class:'grid'},
                    table()
                )
            }
        },

        rows : [],

        initialize       : function(options){

            var me = this;

            this.parent(options);

            /*_(this.definition.rows()).each(function(row_d){
                //создаем строки на основании Definition
                var crow = new Row(row_d);
                me.rows.push(crow);
            });*/
        },

        inject : function(element){

            this.parent(element);
            var view = this.view.getElement('table');

            this.rows.each(function(row){
                row.inject(view);
            });
        },

        render : function(){

            this.rows.each(function(row){
                row.render();
            });
            this.fireEvent('rendered');
        }
    });

    return CellGrid;

});