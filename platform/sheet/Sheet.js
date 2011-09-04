
define(
    [
        'platform/base/Definition',
        'platform/sheet/Column',
        'platform/sheet/Row'
    ],
    function(
        Definition,
        Column,
        Row
    ){

    return new Class({

        Implements : [Events, Options, Definition],

        Binds : [
            'createColumn',
            'createRow'
        ],

        fn : {},

        options : {
            defaultWidgetsFor : {
                'string'  : 'widgets.text',
                'boolean' : 'widgets.checkbox'
            }
        },

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
                    alias : 'fields.collection',
                    property: true,
                    elementConstructor : this.createColumn
                },
                {
                    name : 'rows',
                    alias : 'fields.collection',
                    property: true,
                    elementConstructor : this.createRow
                }
            ]);


            this.setOptions(options);
            this.setup(definition);

            this.ensureModel();

        },

        /**
         * Проверяет текущую структуру листа на соответствие
         * требованиям модели (наличие всех необходимых колонок).
         * Приводит структуру листа к надлежащему виду. Таким образом,
         * все модели всегда будут правильно заполнены.
         */
        ensureModel : function(){

            var me = this,
                model;

            //работем только, если модель указана
            if(!this.modelClass()) return;

            //экземпляр
            model = new (this.modelClass())();

            Object.each(model.fields, function(field, key){

                var hasColumn;

                hasColumn = me.columns.getAll().some(function(column){
                    return column.dataIndex() == key;
                });

                if (!hasColumn){
                    //добавляем на лист колонку
                    me.addColumn({
                        value : field.options.humanTitle || field.name,
                        dataIndex: key,
                        defaultWidget : {
                            alias : me.options.defaultWidgetsFor[field.options.valueType] || 'widgets.text'
                        }
                    });
                }
            });

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

});

