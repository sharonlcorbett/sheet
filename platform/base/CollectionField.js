/**
 * Класс заголовков таблицы
 * @param settings
 */
define(['platform/base/List'], function(List){

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

        constructElement : function(elem){

            switch(typeOf(this.elementConstructor)){

                case 'class':
                    return new this.elementConstructor(elem);
                    break;
                case 'function':
                    return this.elementConstructor(elem);
                    break;
                default :
                    return elem;
                    break;
            }
        },

        addElement : function(element, action, action_element){

            element = this.constructElement(element);

            if((action == 'before' || action == 'after') & !action_element){
                //action_element must be provided
                return;
            }

            switch(action){

                case 'before':
                    this.collection.insertBefore(element, action_element);
                    break;

                case 'after':
                    this.collection.insertAfter(element, action_element);
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
                action_element,
                this.collection.indexOf(action_element)
            ]);

            return element;
        },

        addElements : function(elems){

            var me = this;
            if (typeOf(this.collectionConstructor) == 'function'){
                me.collection = this.collectionConstructor(elems);
            } else {
                elems.each(function(elem){
                    me.addElement(elem);
                })
            }
        },

        defaultSetMethod : function(){

            return this.addElements.apply(this, arguments)
        },

        defaultGetMethod : function(){

            return this.getAll.apply(this, arguments)
        },

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
            })
            return dump;
        },

        each : function(){
            this.collection.each.apply(this.collection, arguments)
        }
    })
})