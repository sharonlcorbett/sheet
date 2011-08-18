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
                //флаг, указывающий на возможность редактирования
                //значение, содержащееся в ячейке
                value      : "Column",
                widget : {
                    type : "Header",
                    value: "Column"
                }
            };

            this.add_setters([
                "value",
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Header;

});