/**
 * Класс заголовков таблицы
 * @param settings
 */
define(function(){

    var Definition = Class.extend({

        init       : function(){

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
        }

    });

    return Definition;

});