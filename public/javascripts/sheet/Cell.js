/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define(["/javascripts/sheet/Formatters.js"], function(Formatters){

    return function(settings){

        /**
         * events
         *  edit_finished
         *  edit_cancelled
         *  widget_ready
         *  click
         */

        var default_settings = {
            //тип виджета для отображения внутри ячейки
            widget_type   : "Text",
            //флаг, указывающий на возможность редактирования
            editable : true,
            //значение, содержащееся в ячейке
            value      : "",
            //формат ячейки
            format     : {},
            //преобразователь значения ячейки в нужный вид
            formatter_type  : "to_string",
            //ячейка таблицы, к которой привязан Cell
            table_cell : null,
            //phantom указывает, создана ли ячейка в DOM
            phantom    : true,
            formatter  : null,
            widget     : null,
            value_field: "value",
            width      : 0
        }

        var return_obj = $.extend({}, default_settings, settings);

        //конструктору может быть передана уже готовая ячейка
        if (return_obj.table_cell){
            return_obj.phantom = false;
        } else {
            return_obj.table_cell = $("<td></td>");
        }

        //return_obj.formatter
        if (!return_obj.formatter){
            return_obj.formatter = Formatters[return_obj.formatter_type];
        }

        //функция привязки событий виджета, выполняется после его инициализации
        var bind_widget_events = function(){
            $(return_obj.widget).bind("edit_finished",  function(){$(return_obj).trigger("edit_finished",  [return_obj])})
            $(return_obj.widget).bind("edit_cancelled", function(){$(return_obj).trigger("edit_cancelled", [return_obj])})
        }

        //ловим инициализацию виджета
        $(return_obj).bind("widget_ready", bind_widget_events);

        if (!return_obj.widget){
            //создание виджета на основе типа объекта
            require(["/javascripts/sheet/widgets/" + return_obj.widget_type + ".js"], function(Widget){
                var wxobj = new Widget(return_obj);
                return_obj.widget = wxobj
                $(return_obj).trigger("widget_ready")
            })
        } else {
            //виджет готов
            $(return_obj).trigger("widget_ready")
        }

        $.extend(return_obj, {

            /**
             * отрисовка виджета с применением форматирования и обновление
             * html- кода ячейки
             */
            render     : function(){

                var me = this;
                if (!this.widget) {
                    $(this).bind("widget_ready", function(){me.widget.render()})
                } else {
                    this.widget.render();
                }
            },

            getValue : function(){
                return this.formatter(this[this.value_field])
            },

            /**
             * Добавление строки в DOM
             * @param parent
             */
            materialize : function(parent){
                //материализация не разрешается для уже матеарилизованных ячеек
                if (!this.phantom) return;
                parent.append(this.table_cell);
                this.phantom = false;
                //теперь Cell можно получить через data
                this.table_cell.data("cell", this);
                var me = this;
                $(this.table_cell).click(function(){$(me).trigger("click")})
            }

        })

        return return_obj
    }
})