/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "/javascripts/sheet/Control.js",
    "/javascripts/sheet/Formatters.js"], function(Control, Formatters){

    return function(settings){

        /**
         * events
         *  edit_finished
         *  edit_cancelled
         *  widget_ready
         *  click
         */

        var default_settings = {
            //флаг, указывающий на возможность редактирования
            editable : true,
            //значение, содержащееся в ячейке
            value      : "",
            //преобразователь значения ячейки в нужный вид
            formatter_type  : "to_string",
            formatter  : null,
            value_field: "value",
            width      : 0
        }

        var return_obj = new Control($.extend(default_settings, settings))

        //return_obj.formatter
        if (!return_obj.formatter){
            return_obj.formatter = Formatters[return_obj.formatter_type];
        }

        $.extend(return_obj, {

            init       : function(){

                this.super()

            },

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