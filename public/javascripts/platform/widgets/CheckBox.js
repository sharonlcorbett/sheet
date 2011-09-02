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
            });
        },

        render : function(){

            this.view.set('checked', this.value() == true ? 'checked' : '');
        },

        inject : function(){

            var me = this;

            this.parent.apply(this, arguments);
            this.view.addEvent('change', function(e){
                me.value(
                    //update value
                    me.view.get('checked')
                );
            })
        }
    })

    return CheckBox;

})

