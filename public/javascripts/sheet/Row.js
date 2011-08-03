/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "/javascripts/sheet/Cell.js"
    ], function(Cell){

    return function(settings, headers, table_row){

        var default_settings = {
            //высота строки
            height      : 20,
            //формат строки
            format      : {},
            //флаг, указывающий, нужно ли создавать ячейки для строки.
            //ячейки создаются на основе заголовков таблицы
            build_cells : true
        }

        var return_obj = $.extend({}, default_settings, settings);

        //конструктору может быть передана уже готовая ячейка
        if (table_row){
            return_obj.table_row = $(table_row);
            return_obj.phantom = false;
        } else {
            return_obj.table_row = $("<tr></tr>");
            return_obj.phantom = true;
        }

        /**
         * функция построения ячеек строки на основании метаданных заголовков таблицы
         * @param headers
         */
        var build_cells = function(headers){

            var cells = []
            $.each(headers, function(){
                //создаем ячейку с метаданными столбца
                cells.push(
                    new Cell({
                        //как правило, в одном столбце будут находится ячейки одного типа
                        //но лист не ограничевает создателя в типах
                        widget_type     : this.column_widget_type,
                        //заголовок может передать свой форматтер, как правило, он одинаковый для
                        //всех ячеек столбца
                        formatter_type  : this.formatter_type,
                        editable        : this.editable
                    })
                )
            })
            return cells
        }

        var cells = []
        //строим ячейки только в том случае, если
        //в настройках указан соответствующий флаг
        if (return_obj.build_cells){
            cells = build_cells(headers)
        }

        //привязка к событиям ячеек
        $(cells).bind("edit_finished",  function(e, cell){$(return_obj).trigger("edit_finished",  [cell])})
        $(cells).bind("edit_cancelled", function(e, cell){$(return_obj).trigger("edit_cancelled", [cell])})

        $.extend(return_obj, {

            cells      : cells,

            /**
             * отрисовка ячеек с применением форматирования и обновление
             * html- кода ячейки
             */
            render     : function(){

                $.each(this.cells, function(){
                    this.render();
                })
            },

            /**
             * Добавление строки в DOM
             * @param parent
             */
            materialize : function(parent){

                var me = this
                //если строка уже материлизована, то ничего делать не нужно
                if (!this.phantom) return;
                $.each(this.cells, function(){
                    //матеарилизуем ячейки в строке
                    this.materialize(me.table_row)
                })
                //добавляем строку к родителю
                parent.append(this.table_row);
                this.phantom = false;
            }
        })

        return return_obj;
    }
})