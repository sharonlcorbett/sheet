
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
                    name: "checked",
                    defaultValue : false,
                    options : {
                        humanTitle : "Статус",
                        valueType  : "boolean"
                    }
                },
                {
                    name: "text",
                    defaultValue : 'Новая запись',
                    options : {
                        humanTitle : "Описание",
                        valueType  : "string"
                    }
                }
            ]);

            this.parent(def)
        }
    })

    return Entry;

})
