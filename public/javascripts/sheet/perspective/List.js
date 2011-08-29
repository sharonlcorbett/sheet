
define(['sheet/Perspective',
        'sheet/Sheet',
        'sheet/Definition',
        'sheet/WidgetManager'], function(Perspective, Sheet, Definition, WidgetManager){

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

            this.watchFields({
                text : {
                    changed : function(text){
                        this.widget.value = text;
                        this.widget.render();
                    }
                }
            })

            this.setup(def)


        },

        applyDefinition: function(def){


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
                            wtype : 'text'
                        }
                    },
                    {
                        value : "Title",
                        defaultWidget : {
                            wtype : 'text'
                        }
                    }
                ],
                rows : []
            }
        },

        sheet : null,

        ready : null,

        initialize : function(options){

            var me = this;

            this.ready = jQuery.Deferred();

            WidgetManager.preloadWidgets([
                'sheet/widgets/Header',
                'sheet/widgets/Text'
            ])
            .then(function(){
                me.parent(options);
                me.createSheet();
                me.ready.resolve();
                me.fireEvent('ready')
            })
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