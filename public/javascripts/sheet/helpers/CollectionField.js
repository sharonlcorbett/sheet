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
            this.elementConstructor = stx.elementConstructor || null;
            this.collectionConstructor = stx.collectionConstructor || null;
            this.collection = [];

            this.serialize = stx.serialize;
        },

        getAll : function(){

            return this.collection;
        },

        addElement : function(elem){

            var el = elem;

            switch(typeOf(this.elementConstructor)){

                case 'class':
                    el = new this.elementConstructor(elem);
                    break;
                case 'function':
                    el = this.elementConstructor(elem);
                    break;
                default :
                    el = elem;
                    break;
            }

            this.collection.push(el);
            this.fireEvent('element_added', el)
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

        removeElement : function(el){

            this.collection.erase(el);
            this.fireEvent('element_removed', el)
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
                dump.push(elem.asJSON());
            })
            return dump;
        }
    })
})