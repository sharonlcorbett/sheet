
define(
    [
        'sheet/Component',
        'sheet/Column',
        'sheet/Row',
        'sheet/ClassManager',
        'sheet/functions/Resize'
    ],
    function(
        Component,
        Column,
        Row,
        ClassManager,
        ResizeFunction
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

        initialize : function(definition, options){

            this.addFields([
                {
                    name : 'resizeMode',
                    defaultValue : 'screen'
                },
                {
                    name : 'modelClass',
                    valueConstructor : function(def){

                        var model_class;
                        if(typeOf(def) != "class"){
                            model_class = ClassManager.getClass(def.alias);
                        }
                        return model_class;
                    }
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

            this.loadFunctions(ResizeFunction)

        },

        loadFunctions : function(){

            var me = this;
            Array.each(arguments, function(F){
                var fn = new F(me);
                me.fn[fn.name] = fn;
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
            row.configure(this);

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

