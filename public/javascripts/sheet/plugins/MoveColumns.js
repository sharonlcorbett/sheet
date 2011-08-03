/**
 * Плагин, предоставляющий возмодность сортировать колонки в таблице.
 * Использует библиотеку JQueryUI и плагин https://github.com/dbrink/sorttable.
 *
 * Отслеживать обновление или удаление колонок в этом плагине не нужно, т.к.
 * это делает JQueryUI
 */
define(["/javascripts/sheet/plugins/Resize.js"],function(){

    return function(){

        /**
         * Добавляет к Sheet события:
         *  column_moved (column)
         */

        return {

            init : function(sheet){

                sheet.table.sorttable({
                    //placeholder : "row_placeholder"
                    //helper : fix_helper,
                    axis : "x",
                    //delay: 100,
                    //cursorAt: {left:20, top:30},
                    opacity:0.5,
                    scroll: true,
                    snap: true,
                    snapMode: "both",
                    distance: 15,
                    cancel: ".th-sep",
                    items : "th:not(.not-orderable)",
                    stop  : function(e, ui){
                        $(sheet).trigger("column_moved", [ui.item.data("cell")])
                    }
                })

                sheet.resize_columns()
            }
        }
    }
})