define(
    [
        'platform/base/Component'
    ],
    function(
        Component
    ){

    var Widget = new Class({

        Extends : Component,

        options : {

            elementTag: 'div',
            elementProperties: {
                class : 'widget'
            }
        },

        value : null,

        initialize : function(options){

            this.parent(options);
        },

        autoRender : true,

        render : function(){

        },

        edit : function(){

        }
    })

    return Widget;

})
