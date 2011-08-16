define(["./Control.js"], function(Control){

    var default_settings = {

        template: "<div class='widget'></div>"
    }

    var Widget = Control.extend({

        init       : function(definition, settings){

            this.add_setters([
                "value"
            ])

            this._super(definition, $.extend({}, default_settings, settings));
        },

        render : function(){

        },

        edit : function(){

        }
    })

    return Widget;

})
