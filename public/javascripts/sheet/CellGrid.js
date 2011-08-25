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
        },

        applyDefinition : function(def){

            this.parent(def)
            var me = this;
            def.each(function(row){
                //создаем строки на основании Definition
                var crow = new Row();
                crow.applyDefinition(row);
                me.rows.push(crow);
            });
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