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

    var TextWidget = new Class({

        Extends : Widget,

        Alias : 'widgets.text',

        options : {

            elementTag: 'span'
        },

        initialize : function(options){

            this.parent(options);
        },

        render : function(){

            return this.view.set('html', this.value.toString());
        }
    })

    return TextWidget;

})

//{
//    edit   : function(){
//
//        var me = this;
//
//        //сохраняем прежнее состояние ячейки
//        var save_state = this.view().html();
//
//        //сохраняем высоту и ширину ячейки
//        var height = '100%';//cell.table_cell.innerHeight();
//        var width  = this.view().width();
//
//        //заменяем содержимое ячейки полем ввода
//        this.view()
//            .html($('<input type='text' value=''+ cell.getValue() + ''></input>'))
//            .addClass('text-editing')
//
//
//        /**
//         * Обработчик отмены редактирования. Выполняется в случае, если
//         * нажата клавиша отмены редактирования (Esc) или новое значение
//         * не отличается от предыдущего
//         */
//        var cancel_handler = function(){
//
//            //удаляем служебные классы и восстанавливаем состояние поля
//            me.view().removeClass('text-editing')
//            me.render()
//
//            //триггер события edit_cancelled
//            $(me).trigger('edit_cancelled')
//        }
//
//        /**
//         * Обработчик завершения редактирования. Выполняется в случае успешного
//         * редактирования, когда не была нажата кнопка отмены и новое значение отличается
//         * от предыдущего
//         */
//        var save_handler = function(){
//
//            var val = me.view().find('input').val()
//            //удаляем служебные классы
//            me.view().removeClass('text-editing')
//
//            if (me.value() != val){
//                me.value(val);
//                $(me).trigger('edit_finished');
//            } else {
//                $(me).trigger('edit_cancelled');
//            }
//
//            //рендер обновленного значения
//            me.render();
//        }
//
//        me.view()
//            .find('input')
//            //высота и ширина поля ввода должны полностью
//            //соответстовать ячейке
//            .css('height', height)
//            .css('width',  '96%')
//            //фокус на поле ввода
//            .focus()
//            //сброс выделения
//            .val(me.view().find('input').val())
//            //привязка событий
//            .bind('blur change', save_handler)
//            .keydown(function(e) {
//                // ESCAPE key pressed
//                if (e.keyCode == 27) {
//                    cancel_handler();
//                }
//
//                if (e.keyCode == 13) {
//                    save_handler();
//                }
//            });
//    }
//}

