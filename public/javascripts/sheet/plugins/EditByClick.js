/**
 * Плагин, активирующий редактирование ячейки по двойному клику
 */
define(function(){

    return function(){

        return {

            handler  : function(cell){

                //не редактируем ничего, если не стоит флаг редактирования
                if (!cell.editable) return;

                cell.table_cell.unbind('dblclick')
                cell.widget.edit();
            },

            bind_row : function(e, row){
                var me = this;
                $.each(row.cells, function(){

                    var cell = this;
                    this.table_cell.dblclick(function(){me.handler(cell)})
                })
            },

            init : function(sheet){

                var me = this;
                $.each(sheet.rows, function(){
                    me.bind_row.call(me, null, this)
                })

                $(sheet).bind("row_added", $.proxy(this.bind_row, me))

                //восстанавливаем двойной клик
                $(sheet).bind("edit_finished edit_cancelled",
                    function(e, cell){
                        cell.table_cell.dblclick(function(){me.handler(cell)})
                    })
            }
        }
    }
})