/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(["sheet/Component"], function(Component){

    var WidgetComponent = new Class({

        Extends : Component,

        widget : null,

        initialize : function(options){

            var me = this;
            this.parent(options);
        },

        applyDefinition : function(def){

            this.parent(def);
            this.initializeWidget();
        },

        initializeWidget : function(){

            var widget = require('sheet/widgets/' + this.definition.widget().type());
            this.widget = new widget();
            this.widget.applyDefinition(this.definition.widget())
        },

        /**
         * отрисовка виджета с применением форматирования и обновление
         * html- кода ячейки
         */
        render     : function(){

        },

        /**
         * Добавление в DOM
         * @param parent
         */
        inject : function(element){

            var me = this;
            //матеарилизация компонента
            this.parent(element);
            this.widget.inject(me.view);
        }
    });

    return WidgetComponent;

})