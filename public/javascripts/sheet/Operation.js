/**
 * Operation — объект, необходимый для контроля выполнения различных
 * операций над объектами с возможностью их отката в порядке применения.
 * Для каждой операции, которая затрагивает структуру листа необходимо
 * определение и выполненение Operation.
 */
define( function(){

    var Operation = Class.extend({

        init : function(){

            this.__resolved = false;
            this.__reverted = false;

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

            if (!this.__resolved || this.__reverted){
                this.forwardFunction(def);
                this.__resolved = true;
            } else {
                throw "You trying to execute operation than has been executed already!"
            }
        },

        /**
         * Выполнение обратной операции над Definition
         * @param def
         */
        rollback : function(def){

            if (this.__resolved || !this.__reverted){
                this.backwardFunction(def);
                this.__reverted = true;
                this.__resolved = false;
            } else {
                throw "You trying to revert operation than has not been executed!"
            }
        },

        /**
         * Возвращает true, если операция выполнена
         */
        isResolved : function(){

            return this.__resolved;
        },

        /**
         * Возвращает true, если операция откатана
         */
        isReverted : function(){

            return this.__reverted;
        }
    })

    return Operation;

});
