/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define(
    [
        'platform/base/Component',
        'platform/sheet/Cell',
        'platform/sheet/Model'
    ],
    function(
        Component,
        Cell,
        Model
    ){

    var Row = new Class({

        Extends : Component,

        options : {

            elementTag : 'tr'
        },

        cells : [],
        idx : null,

        sheet : null,

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
                    alias : 'fields.collection',
                    property: true,
                    elementConstructor : function(def){
                        var cell = new Cell(def);
                        cell.row = this;
                        return cell;
                    }
                },
                {
                    name : 'model'
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

        configure : function(sheet){

            var me = this;

            this.sheet = sheet;

            if (this.cells.count() == 0){

                me.sheet.columns.each(function(column){
                    var cell = me.cells.addElement({});
                    cell.row = me;
                    cell.column = column;
                });
            } else {
                this.applyColumns(sheet.columns.getAll())
            }

            if (this.sheet.modelClass()){

                this.model(
                    createOrReturn(this.model(), this.sheet.modelClass())
                );

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