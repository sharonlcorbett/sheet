
define(
    [
        'platform/base/Definition'
    ],
    function(
        Definition
    ){

    var Model = new Class({

        Implements : [Definition],

        initialize: function(def){

            this.addFields([
                {
                    name : 'alias'
                }
            ])

            this.setup(def);
        }
    })

    return Model;

})
