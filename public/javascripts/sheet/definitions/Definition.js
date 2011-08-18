/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    var Definition = Class.extend({

        init       : function(){

        },

        setup      : function(settings){

            this.setup_if(settings, false);
        },

        setup_if : function(settings, check_if_exists){

            if (typeof check_if_exists == "undefined") check_if_exists = true;

            if (!settings) return;
            var me = this;
            $.each(settings, function(key, value){
                if (!(check_if_exists * (typeof me[key] != "undefined"))){

                    if (typeof me[key] != "function"){
                        me.add_setters([key]);
                    }
                    me[key](value);
                }
            });
        }

    });

    return Definition;

});