/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(["sheet/Control"], function(Control){

    /**
     * События:
     *  materialized
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     */

    var default_settings = {

        widget : null
    };

    var WidgetControl = Control.extend({


        init       : function(definition, settings){

            var me = this;
            this._super(definition, $.extend({}, default_settings, settings));

            this.definition = definition;

            //проверяем наличие описания виджета в Definition
            if (!this.definition.widget() && !this.definition.inherited_widget()){
                throw "Widget must be set in WidgetControl";
            }

            //widget_loading — Deffered объект, который будет отпущен после загрузки виджета
            this.widget_loading = this.load_widget();

            //функция привязки событий виджета, выполняется после его инициализации
            this.widget_loading.done(function(){

                //передача виджету первоначального значения из контрола
                me.widget.value(me.definition.value());
            });

            $(this.definition).bind("setter", function(e, name, value){

                switch(name){
                    case "value":
                        //при изменении значения value в definition мы должны изменить значение в виджете
                        this.widget.value(value);
                        //TODO: Может отдать эту логику виджету?
                        this.widget.render();
                        break;
                }
            });

        },

        load_widget : function(){

            var me = this,
                widget_definition,
                d;

            d = $.Deferred();
            if (this.widget) {
                this.widget_loading.resolve();
            }

            widget_definition = this.definition.widget() || this.definition.inherited_widget();

            //создание виджета на основе типа объекта
            require(["sheet/widgets/" + widget_definition.type()], function(Widget){
                //асинхронная загрузка и инициализация виджета
                me.widget = new Widget(widget_definition);
                d.resolve();
            });

            return d.promise();
        },

        /**
         * отрисовка виджета с применением форматирования и обновление
         * html- кода ячейки
         */
        render     : function(){

            var me = this;
            this.widget_loading.done(function(){
                me.widget.render();
                $(me).trigger("rendered");
            })
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        materialize : function(parent){

            var me = this;
            //матеарилизация компонента
            this._super(parent);
            //материализация виджета компонента
            this.widget_loading.done(function(){
                me.widget.materialize(me.view);
            });
        }
    });

    return WidgetControl;

})