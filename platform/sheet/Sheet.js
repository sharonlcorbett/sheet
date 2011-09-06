
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
        
        Extends : Definition,

        Implements : [Events, Options, Definition],
        
        Alias : 'sheet.main',

        fn : {},

        options : {
            defaultWidgetsFor : {
                'string'  : 'widgets.text',
                'boolean' : 'widgets.checkbox'
            }
        },

        initialize : function(definition, options){
            
            var me = this;
            
            this.parent(options)

            this.addFields([
                {
                    name : 'resizeMode',
                    defaultValue : 'screen'
                },
                {
                    name : 'modelClass',
                    valueConstructor : function(def){

                        if(typeOf(def) == "class"){
                            return def;
                        } else {
                            return ClassManager.getClass(def.alias);                            
                        }
                    }
                },
                {
                    name : 'columns',
                    alias : 'fields.collection',
                    property: true,
                    elementConstructor : function(column){
                        return me.createColumn(column)
                    }
                },
                {
                    name : 'rows',
                    alias : 'fields.collection',
                    property: true,
                    elementConstructor : function(row){
                        return me.createRow(row)   
                    }
                }
            ]);

            this.setup(definition);
            this.ensureModel();
            
            this.bindColumnActions();           

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

            //экземпляр для анализа
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
        cellAt : function(row, column){

            return this.rows.getAt(row).cells.getAt(column);
        },

        columnAt : function(columnIndex){

            return this.columns.getAt(columnIndex);
        },

        rowAt : function(rowIndex){

            return this.rows.getAt(rowIndex);
        },

        /**
         * LOADING MECHANICS
         */

        createColumn : function(column){

            return ClassManager.createIf(column, Column);
        },

        createRow : function(row){

            row = ClassManager.createIf(row, Row);            
            row.configure(this);

            return row;
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

        removeRowAt : function(rowIndex){

            this.rows.field.removeElement(
                this.rowAt(rowIndex)
            );
        },

        removeColumnAt : function(columnIndex){

            this.columns.field.removeElement(
                this.columnAt(columnIndex)
            );
        },
        
        bindColumnActions : function(){

            var me = this;
            this.watchFields({
                
                columns : {
                    
                    //привязываемся к событию добавления строки
                    elementAdded : function(column, 
                                            columnIndex,
                                            action, 
                                            actionColumn, 
                                            actionIndex){                        

                        //добавляем к каждой строке ячейку
                        me.rows.each(function(row){                        
                            var cell = row.cells.addElement({}, action, null, actionIndex);
                            cell.column = column;
                        });                       
                    },
                    
                    elementRemoved : function(column, columnIndex){
                
                        //удаляем ячейку из строки
                        me.rows.each(function(row){
                            row.cells.removeElementAt(columnIndex);
                        })
                    }
                }
            })     
        }
        
        
    });

});

