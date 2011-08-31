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

    var HeaderWidget = new Class({

        Extends : Widget,

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

            this.options.elementTemplate.render({value:this.value}).replaces(this.view);
        }
    })

    HeaderWidget.alias = 'HeaderWidget';

    return HeaderWidget;

})

