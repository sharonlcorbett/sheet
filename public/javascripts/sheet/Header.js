define([
    "./WidgetControl.js"], function(WidgetControl){

    var default_settings = {

        template : "<td></td>"
    }

    var Header = WidgetControl.extend({

        init       : function(definition, settings){

            this.definition = definition;
            this._super(definition, $.extend({}, default_settings, settings));
        }
    })

    return Header;

})