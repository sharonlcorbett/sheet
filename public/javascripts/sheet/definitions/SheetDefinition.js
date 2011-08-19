/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/Definition',
    'sheet/definitions/ColumnDefinition',
    'sheet/definitions/RowDefinition',
    'sheet/definitions/CellDefinition'
    ], function(
        Definition,
        ColumnDefinition,
        RowDefinition,
        CellDefinition){

    var SheetDefinition = Definition.extend({

        init : function(definition){

            var me = this;

            this.obj = {};
            this.obj.columns = [];
            this.obj.rows    = [];

            this.setup(definition);

            $(this).trigger("loaded");
        },

        loadColumns : function(columns){

            var me = this;
            $.each(columns, function(index, column){
                column["orderId"] = index;
                me.obj.columns.push(new ColumnDefinition(column));
            });
        },

        loadRows : function(rows){

            var me = this;
            _(rows).each(function(row){

                if(row.cells.length != me.columnsCount()){
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
                this.loadColumns(columns);
            }
            return this.obj.columns;
        },

        rowCount : function(){

            return this.obj.rows.length;
        },

        columnsCount : function(){

            return this.obj.columns.length;
        },

        buildInheritedCellDefinitions : function(){

            var cells = [];

            _(this.columns()).each(function(column){
                cells.append(new CellDefinition({
                    column : column
                }));
            });

            return cells;
        },

        rows : function(rows){

            if (typeof rows != "undefined"){
                this.loadRows(rows);
            }
            return this.obj.rows;
        }

    })

    return SheetDefinition;

})