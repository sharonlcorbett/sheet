define([
    'sheet/Operation'
], function(
    Operation){

    return {

        change_cell : new Class({

            Extends : Operation,

            initialize : function(stx){

                this.row_idx    = stx.row_idx;
                this.col_idx    = stx.col_idx;
                this.value      = stx.value;
                this.field_name = stx.field_name;

                this.parent();
            },

            forwardFunction : function(sheet){

                var cell = sheet.definition.cellAt(this.row_idx, this.col_idx);
                this.revert_value = cell[this.field_name].field.getValueStrict();
                cell[this.field_name](this.value);
            },

            backwardFunction: function(sheet){

                var cell = sheet.definition.cellAt(this.row_idx, this.col_idx);
                cell[this.field_name](this.revert_value);
            }
        })
    }

});
