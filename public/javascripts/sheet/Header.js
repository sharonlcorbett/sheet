/**
 * Класс заголовков таблицы
 * @param settings
 */
define(["./Cell.js",
        "./Meta.js"], function(Cell, Meta){

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        editable : false,
        //значение, содержащееся в ячейке
        value      : "New column",
        widget_type: "Header",
        template   : "<th></th>"
    }

    var Header = Cell.extend({

        init       : function(settings){

            this.add_setters([
                "flex",
                "resizable",
                "orderable"
            ]);

            this._super($.extend({}, default_settings, settings));
        },

        meta : new Meta()

    })

    return Header;

})