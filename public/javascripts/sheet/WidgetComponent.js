/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(
    [
        'sheet/Component',
        'sheet/ClassManager',
        'sheet/Widget'
    ],
    function(
        Component,
        ClassManager,
        Widget
    ){

    var WidgetComponent = new Class({

        Extends : Component,

        initialize : function(options){

            var me = this;
            this.parent(options);
        },

        initializeWidget : function(){

            if (!instanceOf(this.widget(), Widget)){
                this.widget(ClassManager.create(
                    //динамическое создание виджета
                    this.widget().alias, this.widget()
                ));
            }
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

            this.initializeWidget()

            var me = this;
            //матеарилизация компонента
            this.parent(element);
            this.widget().inject(me.view);
        }
    });

    return WidgetComponent;

})