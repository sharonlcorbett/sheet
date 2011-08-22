define([
    "sheet/Operation",
    "sheet/OperationManager"
], function(
    Operation,
    OperationManager){

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

    OperationManager.register("cell_field_operation", ChangeCellFieldValue);

});
