define([
    'sheet/Operation'
], function(
    Operation){

    return {

        change_cell : new Class({

            Extends : Operation,

            initilize : function(rowx, colx, field_name, value){

                this.row_idx  = rowx;
                this.col_idx = colx;
                this.value = value;
                this.field_name = field_name;

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
