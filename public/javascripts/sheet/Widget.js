define(["sheet/Control"], function(Control){



    var Widget = Control.extend({

        init       : function(definition, settings){

            var default_settings = {

                template: "<div class='widget'></div>"
            }

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
