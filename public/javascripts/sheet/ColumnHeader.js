define([
    "sheet/WidgetControl"], function(WidgetControl){

    var ColumnHeader = WidgetControl.extend({

        init       : function(definition, settings){

            var default_settings = {
                //переопределяем стандартный шаблон контрола, т.к. у нас заголовки таблицы
                template : "<th></th>"
            };

            this.column_definition = definition;
            this.definition = definition.header();
            this._super(this.definition, $.extend({}, default_settings, settings));
        }
    });

    return ColumnHeader;

});