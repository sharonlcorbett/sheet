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

    var Header = new Class({

        Extends : Definition,

        initialize       : function(def){

            this.addFields([
                {
                    name : 'value',
                    defaultValue : 'Header'
                },
                {
                    name : 'widget',
                    valueConstructor : WidgetDefinition,
                    defaultValue : {
                        type : 'Header'
                    }
                }
            ]);

            this.parent(def)
        }
    });

    return Header;

});