
define(['sheet/Perspective',
        'sheet/Sheet',
        'sheet/Definition'], function(Perspective, Sheet, Definition){

    var Entry = new Class({

        Implements : [Definition],

        initialize: function(def){

            this.addFields([
                {
                    name : "widget"
                },
                {
                    name:"text"
                }
            ])

            this.setup(def)
        },

        applyDefinition: function(def){

            this.watchFields({
                text : {
                    changed : function(text){
                        this.widget.value = text;
                        this.widget.render();
                    }
                }
            })
        }

    })

    var List = new Class({

        Extends : Perspective,

        Implements : [Options, Events],

        options : {

            sheetDefinition : {

                columns : [
                    {
                        value : "",
                        defaultWidget : {
                            type : 'Text'
                        }
                    },
                    {
                        value : "Title",
                        defaultWidget : {
                            type : 'Text'
                        }
                    }
                ],
                rows : []
            }
        },

        sheet : null,

        initialize : function(options){

            this.parent(options);
            this.createSheet();
        },

        createSheet : function(){

            this.sheet = new Sheet(this.options.sheetDefinition);
        },

        createEntry : function(def){

            return new Entry(def)
        },

        addEntry : function(entry){

            this.sheet.addRow({
                cells : [
                    {

                    },
                    {
                        widget : entry.widget
                    }
                ]
            });

        }
    });

    return List;

});