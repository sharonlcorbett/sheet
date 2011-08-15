define(["./Control.js"], function(Control){

    var default_settings = {

        template: "<div class='widget'></div>"
    }

    var Widget = Control.extend({

        init       : function(settings){

            this.add_setters([
                "value"
            ])

            this._super($.extend({}, default_settings, settings));
        },

        render : function(){

        },

        edit : function(){

        }
    })

    return Widget;

})
