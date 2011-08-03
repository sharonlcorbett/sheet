/**
 * Строка заголовков, одна на лист
 */
define(["/javascripts/sheet/Row.js"], function(Row){

    return function(headers){

        //наследуем функционал обычной строки
        var me = Row({
            //запрещаем создание ячеек на основе заголовков
            //вместо этого мы передадим сами заголовки
            build_cells: false,
            //высота строки
            height     : 40,
            width      : 5
        });

        //ячейками являются сами заголовки
        me.cells = headers;
        return me;
    }
})