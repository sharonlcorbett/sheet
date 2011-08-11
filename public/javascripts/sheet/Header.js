/**
 * Класс заголовков таблицы
 * @param settings
 */
define(["/javascripts/sheet/Cell.js"], function(Cell){

    var pv = {};
    var meta_pv = {};

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        editable : false,
        //значение, содержащееся в ячейке
        value      : "New column",
        widget_type: "Header",
        template   : "<th></th>"
    }

    var Meta = Class.extend({

        init : function(){

            this.add_setters([
                "widget_type",
                "editable",
                "value",
                "resizable",
                "orderable"
            ], meta_pv)
        }
    });

    var Header = Cell.extend({

        init       : function(settings){

            this.add_setters([
                "flex",
                "resizable",
                "orderable"
            ], pv);

            this._super($.extend({}, default_settings, settings));
        },

        meta : new Meta()

    })

    return Header;

})