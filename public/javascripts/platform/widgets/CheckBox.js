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

            var me = this;

            this.parent(options);

            this.watchFields({
                value : {
                    changed : function(){
                        me.render()
                    },
                    connected : function(){
                        me.render()
                    }
                }
            })

        },

        render : function(){

            this.view.set('checked', this.value() == true ? 'checked' : '');
        }
    })

    return CheckBox;

})

