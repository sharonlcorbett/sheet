/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * текстовый виджет, just text
 */
define(
    [
        'platform/base/Widget'
    ],
    function(
        Widget
    ){

    var CheckBox = new Class({

        Extends : Widget,

        Alias : 'widgets.checkbox',

        options : {

            elementTemplate: function(params){
                input({type:'checkbox', checked:(params.checked ? 'checked' : '')})
            }
        },

        initialize : function(options){

            this.parent(options);
        },

        render : function(){

            this.view.set('checked', this.value == true ? 'checked' : '');
        }
    })

    return CheckBox;

})

