/**
 * Класс заголовков таблицы
 * @param settings
 */
define(["/javascripts/sheet/Cell.js"], function(Cell){

    return function(settings){

        //настройки по-умолчанию
        var default_settings = {
            title             : "New column",
            flex              : 1,
            value_field       : "title",
            editable          : true,
            resizable         : true,
            orderable         : true,
            widget_type       : "Header",
            column_widget_type: "Text"
        }

        //заголовок наследуется от обычной ячейки для удобства
        //материализации и рендеринга
        var me = new Cell(default_settings);

        $.extend(me, settings)

        //заголовок имеет другой тег
        me.table_cell = $("<th " + (!me.resizable ? "class='.not-resizable'" : "") + "></th>");

        return me
    }

})