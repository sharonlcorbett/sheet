/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    return new Class({

        Implements: Events,

        Binds : ['defaultGetMethod', 'defaultSetMethod'],

        initialize : function(stx){

            this.uid  = String.uniqueID();
            this.name = stx.name;
            this.valueConstructor = stx.valueConstructor || null;
            this.changer = stx.changer || null;
            this.emptyGetter = stx.emptyGetter || null;
            this.defaultValue = stx.defaultValue;

            this.value = undefined;
            this.fixed = stx.fixed || false;

            this.setDefault();

            this.applied = false;
            this.freezed = false;
        },

        setDefault : function(){

            if (typeOf(this.defaultValue) != "null"){
                this.setValue(this.defaultValue);
            }
        },

        removeValue : function(){

            this.setValueStrict(undefined);
        },

        getValue : function(){

            if (typeof this.value == "undefined" && typeOf(this.empty) == "function"){
                return this.empty()
            }
            return this.value;
        },

        freeze : function(){

            this.freezed = true;
        },

        unFreeze : function(){

            this.freezed = false;
        },

        setValue : function(val){

            if (this.fixed && this.applied || this.freezed) return;

            if (typeOf(this.changer) != "null"){
                return this.changer(this);
            }

            var value = val;
            if (typeOf(this.valueConstructor) != "null"){
               return this.setValueStrict(this.valueConstructor(value));
            }
            return this.setValueStrict(value);
        },

        defaultSetMethod : function(){

            return this.setValue.apply(this, arguments)
        },

        defaultGetMethod : function(){

            return this.getValue.apply(this, arguments)
        },

        setValueStrict : function(val){

            if (this.fixed && this.applied) return;

            this.value = val;
            this.fireEvent("changed");
            this.applied = true;
            return this.value;
        }
    })
})