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
        'sheet/Widget'
    ],
    function(
        Widget
    ){

    var CheckBox = new Class({

        Extends : Widget,

        options : {

            elementTemplate: function(params){
                input({type:'checkbox', checked:(params.checked ? 'checked' : '')})
            }
        },

        initialize : function(options){

            this.parent(options);
        },

        render : function(){

            this.options.elementTemplate.render({checked : this.value == true}).replaces(this.view);
        }
    })

    CheckBox.alias = 'CheckBoxWidget';

    return CheckBox;

})

