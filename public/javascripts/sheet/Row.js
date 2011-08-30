/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define(
    [
        'sheet/Component',
        'sheet/Cell'
    ],
    function(
        Component,
        Cell
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
        },

        dataProjection : function(){

            var projection = {}
            this.cells.each(function(cell){

                projection[cell.column.dataIndex()] = cell.value.field;
            })

            return projection;
        }

    })

    return Row;

});