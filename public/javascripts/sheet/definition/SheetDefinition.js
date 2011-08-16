/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./ColumnDefinition.js', './RowDefinition.js'], function(ColumnDefinition, RowDefinition){

    var SheetDefinition = Class.extend({

        init : function(definition){

            var me = this;

            this.obj = {};
            this.def = {};
            this.obj.columns = [];
            this.obj.rows    = [];

            $.extend(true, this.def, definition);

            _(this.def.columns).each(function(column){
                me.obj.columns.push(new ColumnDefinition(column));
            });

            _(this.def.rows).each(function(row){

                if(row.cells.length != me.columns_count()){

                    throw "Wrong row definition: Cell count mismatch!"
                }

                var crow = new RowDefinition(row);
                me.obj.rows.push(crow);

                $(crow.cells()).each(function(index, cell){

                    cell.column(me.columns()[index]);
                })
            });

            $(this).trigger("loaded");
        },

        columns  : function(){

            return this.obj.columns;
        },

        row_count : function(){

            return this.obj.rows.length;
        },

        columns_count : function(){

            return this.obj.columns.length;
        },

        rows : function(){

            return this.obj.rows;
        }

    })

    return SheetDefinition;

})