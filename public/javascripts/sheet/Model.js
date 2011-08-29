
define(['sheet/Definition'], function(Definition){

    var Model = new Class({

        Implements : [Definition],

        initialize: function(def){

            var me = this;
            this.setup(def);
        }
    })

    return Model;

})
