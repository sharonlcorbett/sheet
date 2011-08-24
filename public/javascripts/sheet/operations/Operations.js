define([
    "sheet/Operation"
], function(
    Operation){

    return {

        cell_field_operation : new Class({

            Extends : Operation,

            initilize : function(row_idx, col_idx, field_name, value){

                this.row_idx  = row_idx;
                this.col_idx = col_idx;
                this.value = value;
                this.field_name = field_name;

                this.parent();
            },

            forwardFunction : function(sheet){

                var cell = sheet.definition.cell(this.row_idx, this.col_idx);
                this.revert_value = cell[this.field_name].field.getValueStrict();
                cell[this.field_name](this.value);
            },

            backwardFunction: function(sheet){

                var cell = sheet.definition.cell(this.row_idx, this.col_idx);
                cell[this.field_name](this.revert_value);
            }
        })
    }

});
