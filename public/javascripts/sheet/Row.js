/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define(
    [
        'sheet/Component',
        'sheet/Cell',
        'sheet/Model',
        'sheet/ClassManager'
    ],
    function(
        Component,
        Cell,
        Model,
        ClassManager
    ){

    var Row = new Class({

        Extends : Component,

        options : {

            elementTag : 'tr'
        },

        cells : [],
        idx : null,

        initialize : function(definition, options){

            var me = this;

            this.addFields([
                {
                    name : 'height',
                    defaultValue : 20
                },
                {
                    name : 'format',
                    defaultValue : null
                },
                {
                    name : 'cells',
                    type : 'collection',
                    property: true,
                    elementConstructor : function(def){
                        var cell = new Cell(def);
                        cell.row = this;
                        return cell;
                    }
                },
                {
                    name : 'model',
                    valueConstructor : function(def){

                        var model = def;
                        if(!instanceOf(def, Model)){
                            model = ClassManager.create(def.alias, def);
                        }
                        return model;
                    }
                }
            ]);

            this.parent(options);
            this.setup(definition);
        },

        applyColumns : function(columns){

            this.cells.each(function(cell, index){
                cell.column = columns[index];
            })
        },

        configure : function(){

            if (this.model()){

                var me = this;
                this.cells.each(function(cell){

                    var dataIndex = cell.column.dataIndex()
                    if(dataIndex){
                        if(me.model().fields[dataIndex]){
                            cell.fields['value'] = me.model().fields[dataIndex];
                        }
                    }
                })
            }
        },

        inject : function(element){

            var me = this;
            this.parent(element);
            this.cells.each(function(cell){
                cell.inject(me.view);
            });
        },

        render : function(){

            this.cells.each(function(cell){
                cell.render();
            });
            this.fireEvent('rendered');
        }

    })

    return Row;

});