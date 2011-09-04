/**
 * Плагин, предоставляющий возмодность сортировать строки в таблице.
 * Использует библиотеку JQueryUI.
 *
 * Отслеживать обновление или удаление строк в этом плагине не нужно, т.к.
 * это делает JQueryUI
 */
define(function(){

    return function(){

        return {

            init : function(sheet){

                // return a helper with preserved width of cells
                var fix_helper = function(e, ui) {
                    ui.children().each(function() {
                        $(this).width($(this).width());
                    });
                    return ui;
                };

                sheet.table.find('tbody:first').sortable({
                    helper: fix_helper,
                    items: 'tr:has(td)',
                    axis  : 'y',
                    delay: 100
                })

            }
        }
    }
})