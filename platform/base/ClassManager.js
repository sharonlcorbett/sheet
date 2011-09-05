

define(function (require, exports, module) {

module.exports.createOrReturn = function(def, klass){

    if(instanceOf(def, klass)){
        return def;
    } else {
        return new klass(def);
    }
};

/**
 * Менеджер классов.
 *
 * Необходим для упрощения создания классов в процессе выполнения
 * приложения. Позволяет создавать классы "на лету", используя назначенные
 * классами alias'ы.
 */
module.exports.ClassManager = new (new Class({

    Implements : [Events],

    initialize : function(sheet){

        this.classes = [];
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

}))();

Class.Mutators.Alias = function(alias){

    if(!alias) return;
    this.alias = alias;
    ClassManager.registerClass(this);
};

});