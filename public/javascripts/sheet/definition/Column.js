/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./Header.js', './Widget.js'], function(Header, Widget){

    var default_settings = {

        flex        : 1,
        resizable   : false,
        orderable   : false,
        editable    : false,
        width       : 0,
        format      : null,
        widget      : {
            type : "Text",
            value: ""
        }
    }

    var Column = Class.extend({

        init       : function(settings){

            this.add_setters([
                "flex",
                "resizable",
                "orderable",
                "editable",
                "width",
                "format",
                ["header", Header],
                ["widget", Widget]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    })

    return Column;

})