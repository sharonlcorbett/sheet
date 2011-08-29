
define(function(){

    var widget_classes = {};

    var WidgetManager = new Class({

        Implements : [Events],

        initialize : function(sheet){

            this.widgets = [];
        },

        preloadWidgets : function(arr){

            var d = jQuery.Deferred();
            var me = this;

            require(arr, function(){
                Array.each(arguments, function(widget_class){
                    me.registerWidget(widget_class)
                })
                d.resolve();
                me.fireEvent('ready')
            })

            return d;
        },

        registerWidget : function(widget_class){

            widget_classes[widget_class.wtype] = widget_class;
        },

        createWidget : function(def){

            return new widget_classes[def.wtype](def);
        },

        knownTypes : function(){
            return Object.keys(widget_classes);
        }


    });

    return new WidgetManager();

});
