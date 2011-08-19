define(["sheet/Component"], function(Component){



    var Widget = Component.extend({

        init       : function(definition, settings){

            var default_settings = {

                template: "<div class='widget'></div>"
            }

            this.addSetters([
                "value"
            ])

            this._super(definition, $.extend({}, default_settings, settings));

        },

        autoRender : true,

        render : function(){

        },

        edit : function(){

        }
    })

    return Widget;

})
