/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/WidgetDefinition'
    ], function(
        WidgetDefinition){

    var Header = Class.extend({

        init       : function(settings){

            var default_settings = {
                //значение, содержащееся в ячейке
                value      : "Column",
                widget : {
                    type : "Header",
                    value: "Column"
                }
            };

            this.addSetters([
                "value",
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Header;

});