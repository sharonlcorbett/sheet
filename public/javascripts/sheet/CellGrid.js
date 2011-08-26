define([
    'sheet/Component',
    'sheet/Row'], function(
        Component,
        Row){

    var CellGrid = new Class({

        Extends : Component,

        Binds : ['addRow'],

        options : {

            elementTemplate: function(){
                div({class:'grid'},
                    table()
                )
            }
        },

        rows : [],

        table_view : null,

        row_def_hash : {},

        initialize       : function(options){

            var me = this;
            this.parent(options);
        },

        applyDefinition : function(sheet_def){

            this.parent(sheet_def)
            var me = this;

            sheet_def.rows().each(this.addRow);

            sheet_def.watchFields({
                rows : {

                    elementAdded : function(row_def){
                        var crow = me.addRow(row_def);
                        crow.inject(me.table_view);
                        crow.render();
                    },
                    elementRemoved : function(row_def){
                        var crow = me.row_def_hash[row_def.uniqueId];
                        crow.view.destroy();
                        me.rows.erase(crow);
                        delete me.row_def_hash[row_def.uniqueId];
                    }
                }
            })
        },

        addRow : function(row_def){

            var crow = new Row();
            crow.applyDefinition(row_def);
            this.rows.push(crow);
            this.row_def_hash[row_def.uniqueId] = crow;
            return crow;
        },

        inject : function(element){

            var me = this;
            this.parent(element);
            this.table_view = this.view.getElement('table');

            this.rows.each(function(row){
                row.inject(me.table_view);
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