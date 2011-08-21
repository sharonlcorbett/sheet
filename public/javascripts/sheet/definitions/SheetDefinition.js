/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'sheet/definitions/Definition',
    'sheet/definitions/ColumnDefinition',
    'sheet/definitions/RowDefinition',
    'sheet/definitions/CellDefinition',
    'sheet/OperationManager'
    ], function(
        Definition,
        ColumnDefinition,
        RowDefinition,
        CellDefinition,
        OperationManager){

    var SheetDefinition = Definition.extend({

        init : function(definition){

            this.obj = {columns : [], rows : []};
            this.operationManager = new OperationManager(this);
            this.setup(definition);

            $(this).trigger("loaded");
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
        },

        /**
         * Возвращает ячейку с координатами (row, col)
         * @param row индекс строки
         * @param col индекс столбца
         */
        cell : function(row, col){

            return this.rows()[row].cells()[col];
        },

        column : function(col_idx){

            return this.columns()[col_idx];
        },

        row : function(row_idx){

            return this.rows()[row_idx];
        },


        /**
         * LOADING MECHANICS
         */

         loadColumns : function(columns){

            var me = this;
            $.each(columns, function(index, column){
                var ccol = new ColumnDefinition(column);
                ccol.operationManager = me.operationManager;
                ccol.idx(index);
                me.obj.columns.push(ccol);
            });
        },

        loadRows : function(rows){

            var me = this;
            $(rows).each(function(index, row){

                if(row.cells.length != me.columnsCount()){
                    throw "Wrong row definition: Cell count mismatch!"
                }

                var crow = new RowDefinition(row);
                crow.operationManager = me.operationManager
                me.obj.rows.push(crow);

                crow.idx(index);

                $(crow.cells()).each(function(index, cell){
                    cell.operationManager = me.operationManager;
                    cell.row(crow);
                    cell.column(me.columns()[index]);
                });
            });
        }

    })

    return SheetDefinition;

})