
define(
    [
        'platform/sheet/Model'
    ],
    function(
        Model
    ){

    var Entry = new Class({

        Extends : Model,

        Alias : "models.entry",

        initialize: function(def){

            var me = this;

            this.addFields([
                {
                    name: "text",
                    defaultValue : 'Новая запись'
                },
                {
                    name: "checked",
                    defaultValue : false
                }
            ]);

            this.parent(def)
        }
    })

    return Entry;

})
