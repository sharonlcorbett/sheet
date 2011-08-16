/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./WidgetDefinition.js'], function(WidgetDefinition){

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        //значение, содержащееся в ячейке
        value      : "Column",
        widget : {
            type : "Header",
            value: "Column"
        }
    };

    var Header = Class.extend({

        init       : function(settings){

            this.add_setters([
                "value",
                ["widget", WidgetDefinition]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Header;

});