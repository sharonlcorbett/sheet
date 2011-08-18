/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * текстовый виджет, just text
 */
define(["sheet/Widget"], function(Widget){



    var HeaderWidget = Widget.extend({

        init : function(definition, settings){

            var default_settings = {
                value : "Column"
            }

            this._super(definition, $.extend({}, default_settings, settings));
        },

        render : function(){

            this.view.html(
                    "<table class='tbl-column-header'>" +
                        "<tr>" +
                            "<td class='column-title'>" +
                                this.value().toString() +
                            "</td>" +
                            "<td class='column-resizer-container'>" +
                                "<div class='column-resizer'></div>" +
                            "</td>" +
                        "</tr>" +
                    "</table>")
        }
    })

    return HeaderWidget;

})

