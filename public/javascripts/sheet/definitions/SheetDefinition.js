/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/Definition',
    'sheet/definitions/ColumnDefinition',
    'sheet/definitions/RowDefinition'
    ], function(
        Definition,
        ColumnDefinition,
        RowDefinition){

    var SheetDefinition = Definition.extend({

        init : function(definition){

            var me = this;

            this.obj = {};
            this.obj.columns = [];
            this.obj.rows    = [];

            this.setup(definition);

            $(this).trigger("loaded");
        },

        load_columns : function(columns){

            var me = this;
            $.each(columns, function(index, column){
                column["order_id"] = index;
                me.obj.columns.push(new ColumnDefinition(column));
            });
        },

        load_rows : function(rows){

            var me = this;
            _(rows).each(function(row){

                if(row.cells.length != me.columns_count()){
                    throw "Wrong row definition: Cell count mismatch!"
                }

                var crow = new RowDefinition(row);
                me.obj.rows.push(crow);

                $(crow.cells()).each(function(index, cell){
                    cell.column(me.columns()[index]);
                });
            });
        },

        columns  : function(columns){

            if (typeof columns != "undefined"){
                this.load_columns(columns);
            }
            return this.obj.columns;
        },

        row_count : function(){

            return this.obj.rows.length;
        },

        columns_count : function(){

            return this.obj.columns.length;
        },

        rows : function(rows){

            if (typeof rows != "undefined"){
                this.load_rows(rows);
            }
            return this.obj.rows;
        }

    })

    return SheetDefinition;

})