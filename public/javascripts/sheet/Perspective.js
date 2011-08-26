
define(['sheet/OperationManager'], function(OperationManager){

    var Perspective = new Class({

        Implements : [Options, Events],

        options : {

            avalibleWidgets : [
                'sheet/widgets/Text',
                'sheet/widgets/Header'
            ]
        },

        initialize : function(options){

            this.setOptions(options);
            this.operationManager
        },

        createSheet : function(){

        }
    });

    return Engine;

});