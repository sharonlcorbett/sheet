/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    var Definition = Class.extend({

        init       : function(){

            this.operationManager = null
        },

        operationStack : null,

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
            $.each(settings, function(key, value){
                if (!(check_if_null * (typeof me[key] != "undefined"))){
                    if (typeof me[key] != "function"){
                        me.addSetters([key]);
                    }
                    me[key](value);
                }
            });
        },

        addSetters : function(settings){

            var me = this;
            var before;

            if (typeof $(me).data("private") == "undefined"){
                $(me).data("private", {});
            }

            if (typeof me.setters == "undefined"){
                me.setters = {};
            }

            if (typeof me.constructed_setters == "undefined"){
                me.constructed_setters = {};
            }

            var private_container = $(me).data("private");

            $.each(settings, function(index, arg){

                var name = arg,
                    class_obj = null,
                    setter_constructor;

                if (!_(arg).isString()){

                    name = arg["name"];
                    class_obj = arg["class"];
                    setter_constructor = arg["setter_constructor"]
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

                if (typeof setter_constructor != "undefined"){
                    me.constructed_setters[name] = setter_constructor(name);
                }

                if (typeof me[name] == "undefined"){
                        me[name] = (me.constructed_setters[name] || me.setters[name])
                }
            })
        }
    });

    return Definition;

});