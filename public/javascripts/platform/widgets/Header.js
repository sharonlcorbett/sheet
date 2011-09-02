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

    var HeaderWidget = new Class({

        Extends : Widget,

        Alias : 'widgets.header',

        options : {

            elementTemplate: function(params){
                table({class: 'tbl-column-header'},
                    tr(
                        td({class: 'column-title'},
                            params.value
                        )
                    )
                )
            }
        },

        initialize : function(options){

            this.parent(options);
        },

        render : function(){

            this.options.elementTemplate.render({value:this.value()}).replaces(this.view);
        }
    })

    return HeaderWidget;

})

