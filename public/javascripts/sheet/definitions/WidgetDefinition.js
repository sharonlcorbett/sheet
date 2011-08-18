define(function(){

    var Widget = Class.extend({

        init       : function(settings){

            var default_settings = {
                type       : "Text",
                //значение, содержащееся в ячейке
                value      : "",
                formatter  : function(x){return x}
            }

            this.add_setters([
                "formatter",
                "type"
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Widget;

});