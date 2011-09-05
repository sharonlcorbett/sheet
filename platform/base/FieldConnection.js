define(function(){
    
    var PARENT_VALUE = 'PARENT_VALUE',
        PRIMARY      = 'PRIMARY';

    return new Class({

        Implements : [Events, Options],

        options : {

            /**
             * parent-value
             */
            type : PRIMARY
        },

        parentField : null,
        
        childField : null,

        initialize : function(options, parent, child){

            var me = this;

            this.parentField = parent;
            this.childField = child;

            this.parentField.addEvent('changed', function(value, field){
                me.childField.fireEvent('changed', [value, me.childField]);
            });

            this.parentField.addEvent('connected', function(type, field){
                me.childField.fireEvent('connected', [type, field]);
            });

            this.setOptions(options);
        }
    });
    
});