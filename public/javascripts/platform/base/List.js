define(function(){

    return new Class({

        Alias : "extras.list",

        Extends : Array,

        remove : function(el){

            this.erase(el);
        },

        removeAt : function(idx){

            this.erase(this[idx]);
        },

        move : function(from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        },

        insertAt: function(pos, el){

            this.splice(pos, 0, el);
        },

        insertBefore: function(el, before){

            this.insertAt(this.indexOf(before), el);
        },

        insertAfter: function(el, after){

            this.insertAt(this.indexOf(after)+1, el);
        },

        insertFirst: function(el){

            this.insertAt(0, el)
        },

        insertLast: function(el){

            this.insertAt(this.length, el);
        }

    })

});