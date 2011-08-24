define([
    'sheet/definitions/Definition'
    ], function(Definition){

    var Widget = new Class({

        Extends : Definition,

        initialize       : function(def){

            this.addFields([
                {
                    name : "settings"
                },
                {
                    name : "type"
                }
            ]);
            this.parent(def)
        }
    });

    return Widget;

});