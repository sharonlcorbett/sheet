/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    var PARENT_VALUE = 'PARENT_VALUE',
        PRIMARY = 'PRIMARY',
        Connection;

    Connection = new Class({

        Implements : [Events, Options],

        options : {

            /**
             * parent-value
             */
            type : PRIMARY
        },

        parentField : null,
        childField : null,

        initialize : function(options, parent, child){

            var me = this;

            this.parentField = parent;
            this.childField = child;

            this.parentField.addEvent('changed', function(value, field){
                me.childField.fireEvent('changed', [value, me.childField])
            });

            this.parentField.addEvent('connected', function(type, field){
                me.childField.fireEvent('connected', [type, field])
            });

            this.setOptions(options);
        }
    })

    return new Class({

        Implements: Events,

        Alias : 'fields.field',

        Binds : ['defaultGetMethod', 'defaultSetMethod'],

        connections : {
            primary : null,
            value : []
        },

        initialize : function(stx){

            var me = this;

            //unique id of field
            this.uid  = String.uniqueID();

            //name of the field
            this.name = stx.name;

            this.valueConstructor = stx.valueConstructor || null;
            this.changer = stx.changer || null;
            this.emptyGetter = stx.emptyGetter || null;
            this.defaultValue = stx.defaultValue;

            this.fixed = stx.fixed || false;

            this.applied = false;
            this.freezed = false;

            this.serialize = stx.serialize;
            if (typeof this.serialize == 'undefined') this.serialize = true;

            if(typeof this.defaultValue != "undefined"){
                this.constructedDefault = this.constructValue(this.defaultValue)
            }

            [
                'setToDefault',
                'removeValue',
                'getValueStrict',
                'getValue',
                'freeze',
                'unFreeze',
                'setValue',
                'setValueStrict'

            ].each(function(value){

                me[value] = _.wrap(me[value], function(){
                    var args = Array.prototype.slice.call(arguments);
                    args.splice(1, 0, value);
                    return me.connectionCall.apply(me, args);
                });
            })
        },

        connectionCall : function(){

            var methodName, func, args, name

            func = arguments[0];
            name = arguments[1];
            args = Array.prototype.slice.call(arguments, 2);

            if (this.connections.primary){

                //вызываем данный метод у праймари
                return this.connections.primary.parentField[name].apply(
                    this.connections.primary.parentField,
                    args
                );

            } else {
                return func.apply(this, args)
            }
        },

        /**
         * Set field value to undefined if defaultValue is presented
         */
        setToDefault : function(){

            if (typeof this.defaultValue != 'undefined'){
                this.setValueStrict(undefined);
            }
        },

        /**
         * Set field value to undefined
         */
        removeValue : function(){

            this.setValueStrict(undefined);
        },

        /**
         * Get field value property. Do not process emptyGetter and defaultValue
         */
        getValueStrict : function(){

            return this.value
        },

        value : undefined,

        /**
         * defaultValue processed by constructValue and stored in constructedDefault
         */
        constructedDefault : null,

        /**
         * Get field current value.
         * If value property is undefined:
         *  1. If emptyGetter provided — empryGetter() returns
         *  2. If defaultValue provided — constructedDefault returns
         */
        getValue : function(){

            if(typeof this.value == 'undefined'){

                if (typeOf(this.emptyGetter) == 'function'){
                    return this.emptyGetter();
                }

                if (typeOf(this.defaultValue) != 'null'){
                    return this.constructedDefault;
                }
            }
            return this.value;
        },

        freeze : function(){

            this.freezed = true;
        },

        unFreeze : function(){

            this.freezed = false;
        },

        /**
         * Process valueConstructor depends of it type.
         * valueConstructor can be: function, class or null/other
         * @param val Processing value
         */
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

        /**
         * Set value if not fixed or frozen.
         * If value is undefined, removeValue is called.
         *
         * Notice, that setValue call constructValue on val
         * @param val
         */
        setValue : function(val, fire_event){

            if (this.fixed && this.applied || this.freezed) return;

            if (typeOf(this.changer) != 'null'){
                return this.changer(this);
            }

            if (typeof val == "undefined"){
                this.removeValue()
                return;
            }

            var value = this.constructValue(val);

            return this.setValueStrict(value, fire_event);
        },

        defaultSetMethod : function(){

            return this.setValue.apply(this, arguments)
        },

        defaultGetMethod : function(){

            return this.getValue.apply(this, arguments)
        },

        /**
         * Set value property without constructValue.
         * @param val
         */
        setValueStrict : function(val, fire_event){

            if(typeof fire_event == "undefined"){
                fire_event = true
            }

            if (this.fixed && this.applied || this.freezed) return;

            this.value = val;

            if (fire_event){
                this.fireEvent('changed', [this.getValue(), this]);
            }

            this.applied = true;
        },

        /**
         * Refurn field value in JSON interpetation.
         *
         * Calls value.asJSON if exists.
         */
        asJSON: function(){

            if (!this.serialize) return;

            if (this.value && typeof this.value.asJSON == 'function'){
                return this.value.asJSON()
            } else {
                return this.value;
            }
        },

        connect : function(options, field) {

            var connection = new Connection(options, field, this);

            switch(connection.options.type){

                case PRIMARY:
                    if (!this.connections.primary) {
                        this.connections.primary = connection;
                    }
                break;

            }

            this.fireEvent('connected', [options.type, field]);
        }

    })
})