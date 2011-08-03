/**
 * Плагин, предоставляющий выделять ячейки таблицы
 *
 */
define(function(){

    return function(){

        return {

            init: function(sheet){
                $(sheet.getCells()).click(function(){
                    //$(this.table_cell).addClass("selected-cell")
                })
            }
        }
    }
})