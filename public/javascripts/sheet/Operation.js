/**
 * Operation — объект, необходимый для контроля выполнения различных
 * операций над объектами с возможностью их отката в порядке применения.
 * Для каждой операции, которая затрагивает структуру листа необходимо
 * определение и выполненение Operation.
 */
define( function(){

    var Operation = new Class({

        initialize : function(){

            this.resolved = false;
            this.reverted = false;

            if (typeof this.forwardFunction == "undefined" ||
                typeof this.backwardFunction == "undefined"){
                throw "Operation must provide forward and backward functions"
            }
        },

        /**
         * Выполнение операции над Definition.
         * @param def
         */
        execute : function(def){

            if (!this.resolved || this.reverted){
                this.forwardFunction(def);
                this.resolved = true;
            } else {
                throw "You trying to execute operation than has been executed already!"
            }
        },

        /**
         * Выполнение обратной операции над Definition
         * @param def
         */
        rollback : function(def){

            if (this.resolved || !this.reverted){
                this.backwardFunction(def);
                this.reverted = true;
                this.resolved = false;
            } else {
                throw "You trying to revert operation than has not been executed!"
            }
        },

        /**
         * Возвращает true, если операция выполнена
         */
        isResolved : function(){

            return this.resolved;
        },

        /**
         * Возвращает true, если операция откатана
         */
        isReverted : function(){

            return this.reverted;
        }
    })

    return Operation;

});
