/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./HeaderDefinition.js', './WidgetDefinition.js'], function(HeaderDefinition, WidgetDefinition){

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

    var ColumnDefinition = Class.extend({

        init       : function(settings){

            this.add_setters([
                "flex",
                "resizable",
                "orderable",
                "editable",
                "width",
                "format",
                ["header", HeaderDefinition],
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }

    })

    return ColumnDefinition;

})