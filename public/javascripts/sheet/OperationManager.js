
define(
    [
        'sheet/operations/Operations'
    ],
    function(
        Operations
    ){

    var operation_classes = {};

    var OperationMananger = new Class({

        initialize : function(sheet){

            this.operations = [];
            this.current_op_idx = -1;
            this.sheet = sheet;
        },

        executeOperation : function(operation){

            this.operations = _.first(this.operations, this.current_op_idx + 1);
            this.operations.push(operation);

            this.goForward();
        },

        rollback : function(){

            this.operations[this.current_op_idx].rollback(this.sheet);
            this.current_op_idx--;
        },

        goForward : function(){

            this.current_op_idx++;
            this.operations[this.current_op_idx].execute(this.sheet);
        },

        createOperation : function(alias, args){

            var operation_class = operation_classes[alias];
            if (typeof operation_class == 'undefined'){
                throw 'Operation ' + alias + ' is not registered!'
            }

            var op = new operation_class(args);
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

    Object.each(Operations, function(value, key){

        OperationMananger.register(key, value);
    })

    return OperationMananger;

});
