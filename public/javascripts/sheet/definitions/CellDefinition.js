/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/Operation",
    "sheet/OperationManager",
    "sheet/definitions/WidgetDefinition",
    "sheet/definitions/Definition"
    ], function(
        Operation,
        OperationManager,
        WidgetDefinition,
        Definition){

    var CellDefinition = Definition.extend({

        init       : function(settings){

            var default_settings = {
            };

            this.createOperation = $.proxy(this.createOperation, this);

            this.addSetters([
                "editable",
                "format",
                {
                    name:"value",
                    setter_constructor : this.createOperation
                },
                "column",
                "row",
                {
                    name : "widget",
                    class : WidgetDefinition
                }
            ]);

            this.setup($.extend({}, default_settings, settings));
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

        row_idx : function(){

            return this.row().idx();
        },

        col_idx : function(){

            return this.column().idx();
        }
    });

    return CellDefinition;

});