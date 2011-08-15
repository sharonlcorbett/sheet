/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    var __def = {};



    var SheetDefinition = Class.extend({

        init : function(definition){

            $.extend(true, __def, definition);
            $(this).trigger("loaded");
        },

        headers   : function(){

        },

        row_count : function(){

            return __def.rows.length;
        },

        columns_count : function(){

            return __def.headers.length;
        }

    })


})