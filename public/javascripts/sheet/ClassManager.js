
define(function(){

    var ClassManager = new Class({

        Implements : [Events],

        initialize : function(sheet){

            this.classes = [];
        },

        preload : function(arr){

            var d = jQuery.Deferred();
            var me = this;

            require(arr, function(){
                Array.each(arguments, function(klass){
                    me.classes[klass.alias] = klass;
                })
                d.resolve();
                me.fireEvent('ready')
            })

            return d;
        },

        registerClass : function(klass){

            this.classes[klass.alias] = klass;
        },

        create : function(alias, def, settings){

            return new this.classes[alias](def, settings);
        },

        known : function(){
            return Object.keys(this.classes);
        }

    });

    return new ClassManager();

});
