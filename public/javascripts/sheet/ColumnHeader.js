define([
    "sheet/WidgetComponent"], function(WidgetComponent){

    var ColumnHeader = new Class({

        Extends : WidgetComponent,

        options : {

            elementTag: 'th'
        },

        initialize : function(options){

            this.parent(options);
        },

        applyDefinition: function(def){

            this.column_definition = def;
            this.definition = def.header();
            this.initializeWidget();
        },

        render : function(){

            this.widget.value = this.definition.value();
            this.widget.render();
        },

        initializeWidget: function(){

            this.parent();
            this.widget.value = this.definition.value();
        }

    });

    return ColumnHeader;

});