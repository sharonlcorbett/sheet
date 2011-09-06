/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'platform/base/Field',
    'platform/base/CollectionField'],
    function(
        Field,
        CollectionField){

    return new Class({

        Implements : [Options],
        
        fields : null,

        uniqueId : null,
        
        options : {
        
        },        

        initialize       : function(options){

            this.fields = {};
            this.uniqueId = String.uniqueID();
            
            this.setOptions(options);  
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
        setupIf : function(settings, checkNull){
            
            var me = this;

            if (typeof checkNull == 'undefined') checkNull = true;
            if (!settings) return;            

            Object.each(settings, function(value, key){

                if (typeof me[key] == 'undefined'){
                    throw 'Unknown field in definition: ' + key;
                }

                if (!(checkNull * (typeof me[key].field.value != 'undefined'))){
                    me[key].field.defaultSetMethod(value);
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

            var me = this,
                fieldClass;

            if(typeOf(stx.name) == 'null'){
                throw 'name of the field must be set';                
            }
            if(typeof stx.alias == 'undefined'){
                stx.alias = 'fields.field';
            }

            //динамическое создание класса
            fieldClass = ClassManager.getClass(stx.alias);
            this.fields[stx.name] = new fieldClass(stx);
                        
            //создаем стандартный геттер-сеттер
            if(stx.property !== true){
                
                //функция доступа
                this[stx.name] = function(){
                    if(arguments.length > 0){
                        return me.fields[stx.name].defaultSetMethod.apply(me.fields[stx.name], arguments);
                    }
                    return me.fields[stx.name].defaultGetMethod();
                }; 
                //прямой доступ к Field через поле функции доступа
                this[stx.name].field = this.fields[stx.name];
                
            } else {
                //прямой доступ к Field без функции доступа
                this[stx.name] = this.fields[stx.name];
            }
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

            var dump = {};
            
            Object.each(this.fields, function(field, key){
                var fieldDump = field.asJSON();
                if (typeof fieldDump != 'undefined'){
                    dump[field.name] = fieldDump;
                }
            });
            
            return dump;
        },

        watchFields : function(stx){

            var me = this;
            
            Object.each(stx, function(events, fieldName){
                Object.each(events, function(callback, eventName){
                    me.fields[fieldName].addEvent(eventName, callback);
                });
            });
        }

    });

});