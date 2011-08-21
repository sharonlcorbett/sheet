/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/Definition',
    'sheet/definitions/WidgetDefinition'
    ], function(
        Definition,
        WidgetDefinition){

    var Header = Definition.extend({

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
                { name : "widget", class : WidgetDefinition}
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Header;

});