
define(
    [
        'sheet/Definition',
        'sheet/WidgetManager',
        'sheet/Model'
    ],
    function(
        Definition,
        WidgetManager,
        Model
    ){

    var Entry = new Class({

        Extends : Model,

        initialize: function(def){

            var me = this;

            this.addFields([
                {
                    name: "text"
                }
            ])

            this.setup(def)
        }
    })

    return Entry;

})
