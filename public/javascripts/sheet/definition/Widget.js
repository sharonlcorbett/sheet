define(function(){

    var default_settings = {

        type       : "Text",
        //значение, содержащееся в ячейке
        value      : "",
        formatter  : function(x){return x}
    }

    var Widget = Class.extend({

        init       : function(settings){

            this.add_setters([
                "value",
                "formatter",
                "type"
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    })

    return Widget;

})