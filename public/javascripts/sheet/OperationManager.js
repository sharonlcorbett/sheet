
define(function(){

    var operation_classes = {};

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

        rollback : function(){

            this.operations[this.__current_op_idx].rollback(this.sheet_def);
            this.__current_op_idx--;
        },

        goForward : function(){

            this.__current_op_idx++;
            this.operations[this.__current_op_idx].execute(this.sheet_def);
        },

        createOperation : function(alias, args){

            var operation_class = operation_classes[alias];
            if (typeof operation_class == "undefined"){
                throw "Operation " + alias + " is not registered!"
            }

            var op =  new operation_class();
            operation_class.apply(op, args);
            return op;
        },

        createAndRunOperation : function(alias, args){

            this.executeOperation(this.createOperation(alias, args));
        }


    });

    OperationMananger.register = function(alias, operation){

        operation.alias = alias;
        operation_classes[alias] = operation;
    }

    return OperationMananger;

});
