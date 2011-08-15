/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['./Widget.js'], function(Widget){

    var default_settings = {

        //флаг, указывающий на возможность редактирования
        //значение, содержащееся в ячейке
        value      : "Column",
        widget : {
            type : "Header",
            value: "Column"
        }
    }

    var Header = Class.extend({

        init       : function(settings){

            this.add_setters([
                "value",
                ["widget", Widget]
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    })

    return Header;

})