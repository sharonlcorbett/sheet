define(function(){

    /**
     * Менеджер классов.
     *
     * Необходим для упрощения создания классов в процессе выполнения
     * приложения. Позволяет создавать классы "на лету", используя назначенные
     * классами alias'ы.
     */
    var ClassManager = new Class({

        Implements : [Events],

        initialize : function(sheet){

            this.classes = [];
        },

        /**
         * Предварительная загрузка классов необходима для ограничения и
         * контроля работы ClassManager'а
         * @param arr Массив путей к модулям для RequireJS
         */
        preload : function(arr){

            var d = jQuery.Deferred();
            var me = this;

            require(arr, function(){
                Array.each(arguments, function(klass){
                    me.registerClass(klass);
                })
                d.resolve();
                me.fireEvent('ready');
            });

            return d;
        },

        /**
         * Регистрация отдельного класса в менеджере классов
         * @param klass
         */
        registerClass : function(klass){

            //поле alias у класса должно быть установлено!
            if(!klass.alias) throw "Alias must be provided for class";
            this.classes[klass.alias] = klass;
        },

        /**
         * Создание класса на основе alias'а и настроечных параметров
         * @param alias
         * @param def
         * @param settings
         */
        create : function(alias, def, settings){

            return new this.classes[alias](def, settings);
        },

        getClass : function(alias){

            return this.classes[alias];
        },

        /**
         * Возвращает список известных типов классов
         */
        known : function(){
            return Object.keys(this.classes);
        }

    });

    return new ClassManager();

});
