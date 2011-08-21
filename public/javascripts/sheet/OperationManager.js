
define( function(){

    var OperationMananger = Class.extend({

        init : function(sheet_def){

            this.operations = [];
            this.__current_op_idx = -1;
            this.sheet_def = sheet_def;
        },

        executeOperation : function(operation){

            this.operations = _.first(this.operations, this.__current_op_idx + 1);
            this.operations.push(operation);

            this.goForward();
        },

        rollbackLastOperation : function(){

            this.operations[this.__current_op_idx].rollback(this.sheet_def);
            this.__current_op_idx--;
        },

        goForward : function(){

            this.__current_op_idx++;
            this.operations[this.__current_op_idx].execute(this.sheet_def);
        }

    })

    return OperationMananger;

});
