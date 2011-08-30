
define(
    [
        'sheet/Component',
        'sheet/Column',
        'sheet/Row'
    ],
    function(
        Component,
        Column,
        Row
    ){

    var Sheet = new Class({

        Extends : Component,

        Binds : [
            'injectComponents',
            'createColumn',
            'createRow'
        ],

        options : {
            elementTag : 'div',
            elementProperties : {
                class : 'xx-sheet'
            }
        },

        fn : {},

        functions : [
            //'sheet/functions/Resize'
        ],

        components : [

        ],

        initialize : function(definition, options){

            this.addFields([
                {
                    name : 'resizeMode',
                    defaultValue : 'screen'
                },
                {
                    name : 'columns',
                    type : 'collection',
                    property: true,
                    elementConstructor : this.createColumn
                },
                {
                    name : 'rows',
                    type : 'collection',
                    property: true,
                    elementConstructor : this.createRow
                }
            ]);

            this.parent(options);
            this.setup(definition);

            this.functionsLoading = this.loadFunctions();
        },

        inject : function(element){

            var me = this;

            this.parent(element);
            this.components.each(function(component){
                component.inject(me.view);
            })
        },

        /**
         * Рендер листа целиком. Вызывает перерисовывание всех дочерних компонент.
         * Может быть крайне медленной операцией при больших размерах листа.
         */
        render : function(){

            this.components.each(function(component){
                component.render();
            });
            this.fireEvent('rendered');
        },

        loadFunctions : function(){

            var me = this;
            require(this.functions, function(){

                //асинхронная загрузка и инициализация виджета
                _(arguments).each(function(F){
                    var fn = new F(me);
                    me.fn[fn.name] = fn;
                });

                me.fireEvent('ready');
            });
        },

        /**
         * Возвращает ячейку с координатами (row, col)
         * @param row индекс строки
         * @param col индекс столбца
         */
        cellAt : function(row, col){

            return this.rows.getAt(row).cells.getAt(col);
        },

        columnAt : function(col_idx){

            return this.columns.getAt(col_idx);
        },

        rowAt : function(row_idx){

            return this.rows.getAt(row_idx);
        },

        /**
         * LOADING MECHANICS
         */

        createColumn : function(column){

            return createOrReturn(column, Column)
        },

        createRow : function(row){

            row = createOrReturn(row, Row);

            if(row.cells.count() == 0){
                this.columns.each(function(column){
                    var cell = row.cells.addElement({});
                    cell.row = row;
                    cell.column = column;
                });
            } else {
                row.applyColumns(this.columns.getAll());
            }

            row.configure();
            return row
        },

        addRow : function(row){

            this.rows.addElement(row);
        },

        addColumn : function(col){

            this.columns.addElement(col);
        },

        removeColumn : function(col){

            this.columns.removeElement(col);
        },

        removeRow : function(row){

            this.rows.removeElement(row);
        },

        removeRowAt : function(idx){

            this.rows.field.removeElement(
                this.rowAt(idx)
            );
        },

        removeColumnAt : function(idx){

            this.columns.field.removeElement(
                this.columnAt(idx)
            );
        }
    });

    return Sheet;

});

