/**
 * Плагин, подсвечивающий строку, над которой находится курсор
 */
define(function(){

    return function(){

        return {

            bind_row : function(e, row){
                row.table_row.bind('mouseenter', function(){
                    $(this).addClass('hover');
                })

                row.table_row.bind('mouseleave', function(){
                    $(this).removeClass('hover');
                })
            },

            init : function(sheet){

                var me = this;
                $.each(sheet.rows, function(){
                    me.bind_row(null, this)
                })

                $(sheet).bind('row_added', this.bind_row)
            }
        }
    }
})