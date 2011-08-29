/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * текстовый виджет, just text
 */
define(['sheet/Widget'], function(Widget){

    var HeaderWidget = new Class({

        Extends : Widget,

        options : {

            elementTemplate: function(params){
                table({class: 'tbl-column-header'},
                    tr(
                        td({class: 'column-title'},
                            params.value
                        ),
                        td({class: 'column-resizer-container'},
                            div({class: 'column-resizer'})
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

    HeaderWidget.wtype = 'header';

    return HeaderWidget;

})

