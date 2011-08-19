/**
 * Строка заголовков, одна на лист
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

        execute : function(sheet){

            if (!this.__resolved || this.__reverted){
                this.forwardFunction(sheet);
                this.__resolved = true;
            } else {
                throw "You trying to execute operation than has been executed already!"
            }
        },

        revert : function(){

            if (this.__resolved || !this.__reverted){
                this.backwardFunction(sheet);
                this.__reverted = true;
                this.__resolved = false;
            } else {
                throw "You trying to revert operation than has not been executed!"
            }
        },

        isResolved : function(){

            return this.__resolved;
        },

        isReverted : function(){

            return this.__reverted;
        }
    })

    return Operation;

});
