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
                widget      : {
                    type : "Text"
                },
                default_value: "",
                order_id    : null
            };

            this.add_setters([
                "flex",
                "resizable",
                "orderable",
                "editable",
                "width",
                "format",
                "default_value",
                "order_id",
                ["header", HeaderDefinition],
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }

    });

    return ColumnDefinition;

});