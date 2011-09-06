
define([
        'platform/base/Definition'
    ],
    function(
        Definition){

    return new Class({

        Implements : [Definition],

        initialize: function(def){

            this.setup(def);
        }
    })

})
