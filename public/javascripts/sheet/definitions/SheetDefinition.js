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

    var SheetDefinition = new Class({

        Extends: Definition,

        Binds: ['createColumns', 'createRows'],

        initialize : function(def){

            this.operationManager = new OperationManager(this);

            this.addFields([
                {
                    name : "resizeMode",
                    defaultValue : "screen"
                },
                {
                    name : "columns",
                    type : "collection",
                    collectionConstructor : this.createColumns
                },
                {
                    name : "rows",
                    type : "collection",
                    collectionConstructor : this.createRows
                }
            ]);

            this.parent(def);
        },

        buildInheritedCellDefinitions : function(){

            var cells = [];
            this.columns().each(function(column){
                cells.append(new CellDefinition({
                    column : column
                }));
            });

            return cells;
        },

        /**
         * Возвращает ячейку с координатами (row, col)
         * @param row индекс строки
         * @param col индекс столбца
         */
        cellAt : function(row, col){

            return this.rows.field.getAt(row).cells.field.getAt(col);
        },

        columnAt : function(col_idx){

            return this.columns.field.getAt(col_idx);
        },

        rowAt : function(row_idx){

            return this.rows.field.getAt(row_idx);
        },


        /**
         * LOADING MECHANICS
         */

        createColumns : function(columns){

            var me = this;
            var collection = []
            columns.each(function(column, index){

                var ccol = new ColumnDefinition(column);

                ccol.operationManager = me.operationManager;
                ccol.idx = index;
                collection.push(ccol);
            });

            return collection;
        },

        createRows : function(rows){

            var me = this;
            var collection = []

            rows.each(function(row, index){

                if(row.cells.length != me.columns.field.count()){
                    throw "Wrong row definition: Cell count mismatch!"
                }

                var crow = new RowDefinition(row);
                crow.operationManager = me.operationManager

                collection.push(crow);

                crow.idx = index;

                crow.cells().each(function(cell, index){
                    cell.operationManager = me.operationManager;
                    cell.row = crow;
                    cell.column = collection[index];
                });
            });

            return collection;
        }

    })

    return SheetDefinition;

})