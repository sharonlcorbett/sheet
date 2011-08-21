/**
 * Фабрика классов Cell, отражающих отдельную ячейку в таблице. Класс описывает ее поведение
 * и внешний вид, ответственен за все операции и события, происходящие
 * с ячейкой.
 *
 * @param settings
 */
define([
    "sheet/Operation",
    "sheet/definitions/WidgetDefinition",
    "sheet/definitions/Definition"
    ], function(
        Operation,
        WidgetDefinition,
        Definition){

    var ChangeCellFieldValue = Operation.extend({

        init : function(row_idx, col_idx, field_name, value){

            this.row_idx  = row_idx;
            this.col_idx = col_idx;
            this.value = value;
            this.field_name = field_name;

            this._super();
        },

        forwardFunction : function(sheet_def){

            var cell = sheet_def.cell(this.row_idx, this.col_idx);
            this.revert_value = cell.setters[this.field_name]();
            cell.setters[this.field_name](this.value);
        },

        backwardFunction: function(sheet_def){

            var cell = sheet_def.cell(this.row_idx, this.col_idx);
            cell.setters[this.field_name](this.revert_value);
        }
    });

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
                console.log(me.row_idx() + " " + me.col_idx())
                var op = new ChangeCellFieldValue(me.row_idx(), me.col_idx(), field_name, value)
                console.log(op)
                console.log(this.operationManager)
                me.operationManager.executeOperation(op);
            }
        },

        value : function(){

            var val = this.setters["value"].apply(this, arguments);
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