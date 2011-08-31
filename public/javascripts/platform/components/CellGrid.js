define(
    [
        'sheet/Component'
    ],
    function(
        Component
    ){

    var CellGrid = new Class({

        Extends : Component,

        Binds : ['addRow', 'resize'],

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

        initialize       : function(options){

            var me = this;
            this.parent(options);
        },

        resize : function(){

            var me = this;
            if(this.sheet.resizeMode() == "screen"){

                this.view.setStyle("width", "100%");

                var total_flex = 0;
                this.sheet.rows.getAt(0).cells.each(function(cell){
                    total_flex += cell.column.flex();
                });

                this.sheet.rows.getAt(0).cells.each(function(cell){

                    cell.view.setStyle("width",
                        Math.round(
                            (cell.column.flex()/total_flex)*me.view.getSize().x
                        )
                    )
                })

            } else {

                var total_width = 0;
                this.sheet.rows.getAt(0).cells.each(function(cell){

                    total_width += cell.column.width();
                    cell.view.setStyle("width", cell.column.width())
                });

                this.view.setStyle("width", total_width);
            }
        },

        loadSheet : function(sheet){

            var me = this;

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
            });

            this.sheet.rows.each(function(row){
                row.inject(me.table_view);
            });

            this.sheet.addEvent('resizeSheet', this.resize)
        },

        inject : function(element){

            this.parent(element);
            this.table_view = this.view.getElement('table');
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