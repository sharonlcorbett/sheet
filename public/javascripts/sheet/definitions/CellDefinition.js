/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/definitions/WidgetDefinition",
    "sheet/definitions/Definition"
    ], function(
        WidgetDefinition,
        Definition){

    var CellDefinition = new Class({

        Extends : Definition,

        column : null,

        row : null,

        initialize       : function(def){

            this.addFields([
                {
                    name : "editable",
                    emptyGetter : function(){
                        return this.column.editable();
                    }.bind(this)
                },
                {
                    name : "format"
                },
                {
                    name: "value",
                    emptyGetter : function(){
                        return this.column.defaultValue();
                    }.bind(this)
                    //setter_constructor : this.createOperation
                },
                {
                    name : "widget",
                    valueConstructor : WidgetDefinition,
                    emptyGetter : function(){
                        return this.column.defaultWidget();
                    }.bind(this)
                }
            ]);

            this.parent(def);
        },

        createOperation : function(field_name){

            var me = this;

            return function(value){

                if(typeof value != "undefined"){
                    var op = this.operationManager.createAndRunOperation(
                        "cell_field_operation", [me.row_idx(), me.col_idx(), field_name, value])
                    me.operationManager.executeOperation(op);
                } else {
                    return me.setters[field_name]();
                }
            }
        },

        rowIdx : function(){

            return this.row.idx;
        },

        colIdx : function(){

            return this.column.idx;
        }
    });

    return CellDefinition;

});