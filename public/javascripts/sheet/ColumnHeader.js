define([
    "./WidgetControl.js"], function(WidgetControl){

    var default_settings = {

        //переопределяем стандартный шаблон контрола, т.к. у нас заголовки таблицы
        template : "<th></th>"
    };

    var ColumnHeader = WidgetControl.extend({

        init       : function(definition, settings){

            this.column_definition = definition;
            this.definition = definition.header();
            this._super(this.definition, $.extend({}, default_settings, settings));
        }
    });

    return ColumnHeader;

});