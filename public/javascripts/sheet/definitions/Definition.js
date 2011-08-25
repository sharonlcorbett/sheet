/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['sheet/helpers/Field',
        'sheet/helpers/CollectionField'], function(Field,
                                                   CollectionField){

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

                if (!(check_if_null * (typeof me[key].field.value != "undefined"))){
                    //console.log("Setup " + key + " with '" + value + "'")
                    me[key](value);
                }
            });
        },

        /**
         * Создает новый Field нужного типа с настройками stx и
         * добавляет его в список fields. Дополнительно создается
         * метод .{name}, вызвав который, можно получить значение
         * поля. Если вызвать данный метод с аргументом, то можно
         * установить значение поля.
         *
         * Получить определенный field можно через объект fields
         * или через поле .{name}.field
         *
         * @param stx Настройки Field
         */
        addField : function(stx){

            var me = this;

            if(typeOf(stx.name) == "null"){throw "name of the field must be set"}

            switch(stx.type){
                case "collection":
                    this.fields[stx.name] = new CollectionField(stx);
                break;

                default:
                    this.fields[stx.name] = new Field(stx);
                break;
            }

            //создаем стандартный геттер-сеттер
            this[stx.name] = function(){
                if(arguments.length > 0){
                    return me.fields[stx.name].defaultSetMethod.apply(me.fields[stx.name], arguments);
                }
                return me.fields[stx.name].defaultGetMethod();
            }

            this[stx.name].field = this.fields[stx.name];
        },

        /**
         * Массовое добавление Field
         * @param array массив настроек
         */
        addFields : function(array){

            var me = this;
            array.each(function(stx){
                me.addField(stx);
            });
        },

        /**
         * Преобразование Definition в JSON представление. Используется
         * для сохранения состояния листа. Значение поля созраняется, если
         * оно определено и отличается от стандартного.
         */
        asJSON : function(){

            var dump = {}
            Object.each(this.fields, function(field, key){

                var field_dump = field.asJSON();
                if (typeof field_dump != "undefined"){
                    dump[field.name] = field_dump;
                }
            });
            return dump;
        },


        watchFields : function(stx){

            var me = this;
            Object.each(stx, function(callback, field_name){
                me.fields[field_name].addEvent("changed", callback);
            })
        }

    });

    return Definition;

});