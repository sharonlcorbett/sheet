/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * Виджет заголовка, just text
 */
define(function(){

    return function(cell){

        return {

            render : function(){
                cell.table_cell.html(
                    "<table class='tbl-column-header'>" +
                        "<tr>" +
                            "<td class='column-title'>" +
                                cell.getValue().toString() +
                            "</td>" +
                            "<td class='column-resizer-container'>" +
                                "<div class='column-resizer'></div>" +
                            "</td>" +
                        "</tr>" +
                    "</table>")
            }
        }
    }
})