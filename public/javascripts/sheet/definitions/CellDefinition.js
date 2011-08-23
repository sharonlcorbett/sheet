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

        initialize       : function(def){

            this.addFields([
                {
                    name : "editable"
                },
                {
                    name : "format"
                },
                {
                    name: "value"
                    //setter_constructor : this.createOperation
                },
                {
                    name : "column"
                },
                {
                    name : "row"
                },
                {
                    name : "widget",
                    valueConstructor : WidgetDefinition
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

        value : function(){

            var val = this.constructed_setters["value"].apply(this, arguments);
            if (typeof val == "undefined"){
                return this.inheritedValue();
            }
            return val;
        },

        inheritedWidget : function(){
            return this.column().defaultWidget();
        },

        inheritedEditable : function(){
            return this.column().editable();
        },

        inheritedValue : function(){
            return this.column().defaultValue();
        },

        rowIdx : function(){

            return this.row().idx();
        },

        colIdx : function(){

            return this.column().idx();
        }
    });

    return CellDefinition;

});