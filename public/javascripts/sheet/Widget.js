define(function(){

    var Widget = Class.extend({

        init       : function(settings){

            this.add_setters([
                "value",
                "parent"
            ])

            this.setup(settings);
        },

        render : function(){

        },

        edit : function(){

        }
    })

    return Widget;

})
