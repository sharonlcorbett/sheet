define([
    'sheet/definitions/Definition'
    ], function(Definition){

    var Widget = Definition.extend({

        init       : function(settings){

            var default_settings = {
                type       : "Text",
                //значение, содержащееся в ячейке
                value      : "",
                formatter  : function(x){return x}
            }

            this.addSetters([
                "formatter",
                "type"
            ]);

            this.setup($.extend({}, default_settings, settings));
        }
    });

    return Widget;

});