/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['sheet/helpers/Field',
        'sheet/helpers/CollectionField'], function(Field, CollectionField){

    var Definition = new Class({

        fields : {},

        initialize       : function(stx){

            this.setup(stx);
            this.operationManager = null
        },

        setup      : function(settings){

            this.setupIf(settings, false);
        },


        /**
         * Настроечная фукнция, передает настроечное значение
         * функции - сеттеру.
         * если его нет
         * @param settings Коллекция настроек
         * @param check_if_null Если строит в true, то существующее
         *                      значение не будет перезаписано.
         */
        setupIf : function(settings, check_if_null){

            if (typeof check_if_null == "undefined") check_if_null = true;

            if (!settings) return;
            var me = this;
            Object.each(settings, function(value, key){

                if (typeof me[key] == "undefined"){
                    throw "Unknown field in definition: " + key
                }

                if (!(check_if_null * (typeof me[key]() != "undefined"))){
                    me[key](value);
                }
            });
        },

        addField : function(stx){

            if(typeOf(stx.name) == "null"){
                throw "name of the field must be set"
            }

            if (stx.type == "collection"){
                this.fields[stx.name] = new CollectionField(stx);
            } else {
                this.fields[stx.name] = new Field(stx);
            }

            var me = this;
            this[stx.name] = function(){

                if(arguments.length > 0){
                    return me.fields[stx.name].defaultSetMethod.apply(me.fields[stx.name], arguments);
                }
                return me.fields[stx.name].defaultGetMethod();
            }

            this[stx.name].field = this.fields[stx.name];
        },

        addFields : function(array){

            var me = this;
            array.each(function(field_stx){

                me.addField(field_stx);
            })
        }
    });

    return Definition;

});