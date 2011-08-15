/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./Column.js', './Row.js'], function(Column, Row){

    var __def = {};
    var __obj = {};

    var SheetDefinition = Class.extend({

        init : function(definition){

            $.extend(true, __def, definition);
            var me = this;

            __obj.columns = [];
            _(__def.columns).each(function(column){
                __obj.columns.push(new Column(column));
            });

            __obj.rows = [];
            _(__def.rows).each(function(row){

                if(row.cells.length != me.columns_count()){

                    throw "Wrong row definition: Cell count mismatch!"
                }
                __obj.rows.push(new Row(row));
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