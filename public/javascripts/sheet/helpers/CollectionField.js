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
        },

        getAll : function(){

            return this.collection;
        },

        addElement : function(elem){

            var el = elem;
            if (typeOf(this.elementConstructor) == "function"){
                el = new this.elementConstructor(elem);
            }

            this.collection.push(el);
            this.fireEvent("element_added", el)
        },

        addElements : function(elems){

            var me = this;
            if (typeOf(this.collectionConstructor) == "function"){
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
            this.fireEvent("element_removed", el)
        },

        getAt : function(index){

            return this.collection[index];
        },

        count : function(){

            return this.collection.length;
        }
    })
})