define([
    'sheet/Component'], function(Component){

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

        sheet : null,

        initialize       : function(sheet, options){

            var me = this;
            this.parent(options);

            this.sheet = sheet;

            this.sheet.watchFields({

                rows : {
                    elementAdded : function(row){
                        row.inject(me.table_view);
                        row.render();
                    },
                    elementRemoved : function(row){
                        row.view.destroy();
                    }
                }
            })
        },

        inject : function(element){

            var me = this;
            this.parent(element);
            this.table_view = this.view.getElement('table');

            this.sheet.rows.each(function(row){
                row.inject(me.table_view);
            });
        },

        render : function(){

            this.sheet.rows.each(function(row){
                row.render();
            });
            this.fireEvent('rendered');
        }
    });

    return CellGrid;

});