/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/Definition',
    'sheet/definitions/HeaderDefinition',
    'sheet/definitions/WidgetDefinition'
    ], function(
        Definition,
        HeaderDefinition,
        WidgetDefinition){

    var ColumnDefinition = Definition.extend({

        init       : function(settings){

            var default_settings = {
                flex        : 1,
                resizable   : false,
                orderable   : false,
                editable    : false,
                width       : 0,
                format      : null,
                defaultWidget: {
                    type : "Text"
                },
                defaultValue : "",
                orderId     : null
            };

            this.addSetters([
                "flex",
                "resizable",
                "orderable",
                "editable",
                "width",
                "format",
                "defaultValue",
                "orderId",
                ["header", HeaderDefinition],
                ["defaultWidget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }

    });

    return ColumnDefinition;

});