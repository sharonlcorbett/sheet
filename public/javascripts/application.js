
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

SheetMixins = {

    setup_mixin : {

        //settings : {},

        setup : function(settings){

            if (!settings) return;
            var me = this;
            $.each(settings, function(key, value){
                if (typeof me[key] == "function"){
                    me[key](value);
                } else {
                    me[key] = value;
                }
            })

            //$.extend(me.settings, settings);
        },

        add_getter : function(name){

            var me = this;

            if (typeof $(me).data("private") == "undefined"){
                $(me).data("private") = {}
            }

            var private_container = $(me).data("private");

            me[name] = function(){

                return private_container[name];
            }
        },

        addSetters : function(array_of_names){

            var me = this;
            var before;

            if (typeof $(me).data("private") == "undefined"){
                $(me).data("private", {})
            }

            if (typeof me.setters == "undefined"){
                me.setters = {};
            }

            var private_container = $(me).data("private");

            $.each(array_of_names, function(index, arg){

                var name = arg;
                var class = null;

                if (_(arg).isArray()){

                    name = arg[0];
                    class = arg[1];
                }

                me.setters[name] = function(arg){

                    if(typeof arg != "undefined"){

                        before = private_container[name];

                        if (class != null && typeof arg.init == "undefined"){
                            arg = new class(arg);
                        }

                        private_container[name] = arg;
                        //$(me).trigger("setter", [name, arg, before]);
                        $(me).trigger(name+"Changed", [arg, before]);
                    }
                    return private_container[name];
                }

                if (typeof me[name] == "undefined"){
                    me[name] = me.setters[name]
                }
            })
        },

        __set_private : function(name, value){

            if (typeof $(this).data("private") == "undefined"){
                $(this).data("private", {})
            }
            var private = $(this).data("private");
            private[name] = value;
        },

        __get_private : function(name){

            if (typeof $(this).data("private") == "undefined"){
                $(this).data("private", {})
            }
            return $(this).data("private")[name];
        },

        addFields : function(){

            this.addSetters.apply(this, arguments);
        },

        fieldsListener : function(objects){

            var me = this;
            _(objects).each(function(callback, key){
                $(me).bind(key + "Changed", callback)
            });
        }

    }
}

$.extend(Class.prototype, SheetMixins.setup_mixin)

// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
