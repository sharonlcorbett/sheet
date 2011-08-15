/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./ColumnDefinition.js', './RowDefinition.js'], function(ColumnDefinition, RowDefinition){

    var __def = {};
    var __obj = {};

    var SheetDefinition = Class.extend({

        init : function(definition){

            $.extend(true, __def, definition);
            var me = this;

            __obj.columns = [];
            _(__def.columns).each(function(column){
                __obj.columns.push(new ColumnDefinition(column));
            });

            __obj.rows = [];
            _(__def.rows).each(function(row){

                if(row.cells.length != me.columns_count()){

                    throw "Wrong row definition: Cell count mismatch!"
                }

                var crow = new RowDefinition(row);
                __obj.rows.push(crow);

                $(crow.cells()).each(function(index, cell){

                    console.log(cell)
                    cell.column(me.columns()[index]);
                })
            });

            $(this).trigger("loaded");
        },

        columns  : function(){

            return __obj.columns;
        },

        row_count : function(){

            return __obj.rows.length;
        },

        columns_count : function(){

            return __obj.columns.length;
        },

        rows : function(){

            return __obj.rows;
        }

    })

    return SheetDefinition;

})