
/*
---

name: Class.PatternMutators

description: Pattern-Based Mutation for MooTools 1.3

license: MIT-style license.

copyright: Mark Obcena

requires: Class

provides: [Class.defineMutator, Class.define]

...
*/


(function(){

var matchers = [];

var lookup = function(key){
	var i = matchers.length;
	while (i--){
		var matcher = matchers[i],
			match = key.match(matcher);
		if (match) return ['$mutator:' + matcher, match.slice(1)];
	}
	return null;
};

Class.defineMutator = function(key, fn){
	if (typeOf(key) == 'regexp'){
		matchers.push(key);
		key = '$mutator:' + key;
		var _fn = fn;
		fn = function(values){
			return _fn.apply(this, values);
		};
	}
	Class.Mutators[key] = fn;
	return this;
};

var define = Class.prototype.implement;
Class.implement('define', define);

var implement = Class.prototype.implement = function(key, value, retain){
	var mutator = lookup(key);
	if (mutator){
		key = mutator.shift();
		mutator[0].unshift(value);
		value = mutator.shift();
	}
	return define.call(this, key, value, retain);
}.overloadSetter();

// Default Mutators
Class.defineMutator(/^protected\s(\w+)/, function(fn, name){
	this.define(name, fn.protect());
});

Class.defineMutator(/^linked\s(\w+)/, function(value, name){
	this.prototype[name] = value;
});

Class.defineMutator(/^static\s(\w+)/, function(fn, name){
	this.extend(name, fn);
});

// Reimplement "implement" in all classes..
for (var i in window){
	try {
		var klass = window[i];
		if (klass instanceof Function && typeOf(klass) == 'class'){
			klass.implement = implement;
			klass.define = define;
		}
	} catch(e){}
}

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

                var name = arg,
                    class_obj = null,
                    setter_constructor = null

                if (!_(arg).isString()){

                    name = arg["name"];
                    class_obj = arg["class"];
                    setter_constructor = arg["operation"]
                }

                me.setters[name] = function(arg, go_trigger){

                    if (typeof go_trigger == "undefined") go_trigger = true;

                    if(typeof arg != "undefined"){

                        before = private_container[name];

                        if (class_obj != null && typeof arg.init == "undefined"){
                            arg = new class_obj(arg);
                        }

                        private_container[name] = arg;
                        //$(me).trigger("setter", [name, arg, before]);
                        if (go_trigger){
                            $(me).trigger(name+"Changed", [arg, before]);
                        }
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
