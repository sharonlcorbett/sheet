/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * текстовый виджет, just text
 */
define(["../Widget.js"], function(Widget){

    var default_settings = {

        value : "Column"
    }

    var HeaderWidget = Widget.extend({

        init : function(settings){

            this._super($.extend({}, default_settings, settings));
        },

        render : function(){

            this.view().html(
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

