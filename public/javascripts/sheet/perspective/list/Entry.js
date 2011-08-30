
define(
    [
        'sheet/Model'
    ],
    function(
        Model
    ){

    var Entry = new Class({

        Extends : Model,

        initialize: function(def){

            var me = this;

            this.addFields([
                {
                    name: "text",
                    defaultValue : 'Новая запись'
                }
            ]);

            this.parent(def)
        }
    })

    Entry.alias = "EntryModel"

    return Entry;

})
