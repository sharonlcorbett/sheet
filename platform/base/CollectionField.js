/**
 * Класс заголовков таблицы
 * @param settings
 */
define([
    'platform/base/List'], 
    function(
        List){
    
    /**
     * Поле, представляющее из себя коллекцию элементов. Реализовано:
     *  - Добавление элементов на произвольное место
     *  - Удаление элементов 
     *  - Перемещение элементов с одного места на другое
     */
    return new Class({

        Implements: Events,

        Alias : 'fields.collection',

        Binds : ['defaultGetMethod', 'defaultSetMethod'],

        elementConstructor : null,
        serialize : true,
        collectionConstructor : null,

        initialize : function(stx){

            this.uid  = String.uniqueID();

            Object.append(this, stx);

            this.collection = new List();
            this.field = this;
        },

        getAll : function(){

            return this.collection;
        },

        /**
         * Передача настроек элемента функции, конструктору или 
         * возвращение элемента в исходном виде, если конструктор
         * не определен.
         */
        constructElement : function(elem){

            switch(typeOf(this.elementConstructor)){

                case 'class':
                    return new this.elementConstructor(elem);

                case 'function':
                    return this.elementConstructor(elem);

                default :
                    return elem;

            }
        },

        /**
         * Добавить элемент в коллекцию, поддерживает указание размещения
         * нового элемента:
         *  action:
         *      after (требуется наличие actionElement)
         *      before (требуется наличие actionElement)
         *      first
         *      last
         *  actionElement - элемент для действий after и before, должен
         *                  присутствовать в коллекции.
         */
        addElement : function(element, action, actionElement){

            //конструируем элемент
            element = this.constructElement(element);

            if((action == 'before' || action == 'after') & !actionElement){
                throw "actionElement must be provided";
            }

            switch(action){

                case 'before':
                    this.collection.insertBefore(element, actionElement);
                    break;

                case 'after':
                    this.collection.insertAfter(element, actionElement);
                    break;

                case 'first':
                    this.collection.insertFirst(element);
                    break;

                default:
                    //last is default
                    this.collection.insertLast(element);
                    break;
            }

            this.fireEvent('elementAdded',[
                element,
                this.collection.indexOf(element),
                action || 'last',
                actionElement,
                this.collection.indexOf(actionElement)
            ]);

            return element;
        },

        /**
         * Добавляем несколько элементов в коллекцию
         * 
         * @param elems Массив элементов для передачи в addElement 
         */
        addElements : function(elems){

            var me = this;
            if (typeOf(this.collectionConstructor) == 'function'){
                //конструируем коллекцию при помощи функции
                this.collection = this.collectionConstructor(elems);
            } else {
                elems.each(function(elem){
                    me.addElement(elem);
                });
            }
        },

        defaultSetMethod : function(){

            return this.addElements.apply(this, arguments);
        },

        defaultGetMethod : function(){

            return this.getAll.apply(this, arguments);
        },

        /**
         * Удаление элемента из коллекции
         */
        removeElement : function(element){

            this.collection.remove(element);

            this.fireEvent('elementRemoved', [
                element,
                this.collection.indexOf(element)
            ]);
        },

        getAt : function(index){

            return this.collection[index];
        },

        count : function(){

            return this.collection.length;
        },

        asJSON: function(){

            var dump = [];
            this.collection.each(function(elem){
                if (typeOf(elem.asJSON) == 'function'){
                    dump.push(elem.asJSON());
                } else {
                    dump.push(elem);
                }
            });
            
            return dump;
        },

        each : function(){
            this.collection.each.apply(this.collection, arguments);
        }
    });
});