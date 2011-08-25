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

            this.applied = false;
            this.freezed = false;

            this.serialize = stx.serialize;
            if (typeof this.serialize == 'undefined') this.serialize = true;
        },

        setToDefault : function(){

            if (typeof this.defaultValue != 'undefined'){
                this.setValueStrict(undefined);
            }
        },

        removeValue : function(){

            this.setValueStrict(undefined);
        },

        getValueStrict : function(){

            return this.value
        },

        constructedDefault : null,

        getValue : function(){

            if (typeof this.value == 'undefined' && typeOf(this.emptyGetter) == 'function'){
                return this.emptyGetter();
            }

            if (typeof this.value == 'undefined' && typeOf(this.defaultValue) != 'null'){
                if(!this.constructedDefault){
                    this.constructedDefault = this.constructValue(this.defaultValue)
                }
                return this.constructedDefault;
            }

            return this.value;
        },

        freeze : function(){

            this.freezed = true;
        },

        unFreeze : function(){

            this.freezed = false;
        },

        constructValue : function(val){

            var value;
            switch(typeOf(this.valueConstructor)){

                case 'class':
                    value = new this.valueConstructor(val);
                    break;
                case 'function':
                    value = this.valueConstructor(val);
                    break;
                default :
                    value = val;
                    break;
            }

            return value;
        },

        setValue : function(val){

            if (this.fixed && this.applied || this.freezed) return;

            if (typeOf(this.changer) != 'null'){
                return this.changer(this);
            }

            if (typeof val == "undefined"){
                this.removeValue()
                return;
            }

            var value = this.constructValue(val);

            return this.setValueStrict(value);
        },

        defaultSetMethod : function(){

            return this.setValue.apply(this, arguments)
        },

        defaultGetMethod : function(){

            return this.getValue.apply(this, arguments)
        },

        setValueStrict : function(val){

            if (this.fixed && this.applied || this.freezed) return;

            this.value = val;
            this.fireEvent('changed', [this, this.getValue()]);
            this.applied = true;
        },

        asJSON: function(){

            if (typeof this.value == 'undefined' || !this.serialize) return;

            if (typeOf(this.value.asJSON) == 'function'){
                return this.value.asJSON()
            } else {
                return this.value;
            }
        }
    })
})