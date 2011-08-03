/**
 * events:
 *  edit_finished
 *  edit_cancelled
 */

/**
 * текстовый виджет, just text
 */
define(function(){

    return function(cell){

        return {

            /**
             * Отрисовка виджета в ячейку таблицы
             */
            render : function(){
                cell.table_cell.html("<div class='format-text'>" + cell.getValue().toString() + "</div>")
            },

            edit   : function(){

                var me = this;

                //сохраняем прежнее состояние ячейки
                var save_state = cell.table_cell.html();

                //сохраняем высоту и ширину ячейки
                var height = "100%";//cell.table_cell.innerHeight();
                var width  = cell.table_cell.width();

                //заменяем содержимое ячейки полем ввода
                cell.table_cell
                    .html($("<input type='text' value='"+ cell.getValue() + "'></input>"))
                    .addClass("text-editing")


                /**
                 * Обработчик отмены редактирования. Выполняется в случае, если
                 * нажата клавиша отмены редактирования (Esc) или новое значение
                 * не отличается от предыдущего
                 */
                var cancel_handler = function(){

                    //удаляем служебные классы и восстанавливаем состояние поля
                    cell.table_cell.removeClass("text-editing")
                    me.render()

                    //триггер события edit_cancelled
                    $(me).trigger("edit_cancelled")
                }

                /**
                 * Обработчик завершения редактирования. Выполняется в случае успешного
                 * редактирования, когда не была нажата кнопка отмены и новое значение отличается
                 * от предыдущего
                 */
                var save_handler = function(){

                    var val = cell.table_cell.find("input").val()
                    //удаляем служебные классы
                    cell.table_cell.removeClass("text-editing")

                    if (cell.value != val){
                        cell.value = val;
                        $(me).trigger("edit_finished");
                    } else {
                        $(me).trigger("edit_cancelled");
                    }

                    //рендер обновленного значения
                    cell.render();
                }

                cell.table_cell
                    .find("input")
                    //высота и ширина поля ввода должны полностью
                    //соответстовать ячейке
                    .css("height", height)
                    .css("width",  "96%")
                    //фокус на поле ввода
                    .focus()
                    //сброс выделения
                    .val(cell.table_cell.find("input").val())
                    //привязка событий
                    .bind("blur change", save_handler)
                    .keydown(function(e) {
                        // ESCAPE key pressed
                        if (e.keyCode == 27) {
                            cancel_handler();
                        }

                        if (e.keyCode == 13) {
                            save_handler();
                        }
                    });
            }
        }
    }
})