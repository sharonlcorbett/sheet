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

    var ColumnDefinition = new Class({

        Extends : Definition,

        idx : null,

        initialize       : function(def){

            this.addFields([
                {
                    name : 'flex',
                    defaultValue : 1
                },
                {
                    name : 'resizable',
                    defaultValue : false
                },
                {
                    name : 'orderable',
                    defaultValue : false
                },
                {
                    name : 'editable',
                    defaultValue : false
                },
                {
                    name : 'width',
                    defaultValue : 0
                },
                {
                    name : 'format',
                    defaultValue : null
                },
                {
                    name : 'defaultValue',
                    defaultValue : ''
                },
                {
                    name : 'header',
                    valueConstructor: HeaderDefinition
                },
                {
                    name : 'defaultWidget',
                    valueConstructor: WidgetDefinition,
                    defaultValue : {
                        type : 'Text'
                    }
                }
            ]);

            this.parent(def)
        }

    });

    return ColumnDefinition;

});