/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(["sheet/Component"], function(Component){

    /**
     * События:
     *  materialized
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     */

    var WidgetComponent = Component.extend({


        init       : function(definition, settings){

            var default_settings = {

                widget : null
            };

            var me = this;
            this._super(definition, $.extend({}, default_settings, settings));

            this.definition = definition;

            //widgetLoading — Deffered объект, который будет отпущен после загрузки виджета
            this.widgetLoading = this.loadWidget();

            //функция привязки событий виджета, выполняется после его инициализации
            this.widgetLoading.done(function(){

                //передача виджету первоначального значения из контрола
                me.widget.value(me.definition.value());
            });

            this.definition.fieldsListener({
                "value" : function(e, value){
                    //при изменении значения value в definition мы должны изменить значение в виджете
                    me.widget.value(value);
                    //TODO: Может отдать эту логику виджету?
                    me.widget.render();
                }
            });

        },

        loadWidget : function(){

            var me = this,
                widget_definition,
                d;

            d = $.Deferred();
            if (this.widget) {
                this.widgetLoading.resolve();
            }

            //проверяем наличие описания виджета в Definition
            widget_definition = this.definition.widget() || this.definition.inheritedWidget();
            if (!widget_definition){
                throw "Widget must be set in WidgetComponent";
            }

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
            var d = $.Deferred();
            this.widgetLoading.done(function(){
                me.widget.render();
                d.resolve();
                $(me).trigger("rendered");
            })

            return d.promise();
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        materializeTo : function(parent){

            var me = this;
            //матеарилизация компонента
            this._super(parent);
            //материализация виджета компонента
            this.widgetLoading.done(function(){
                me.widget.materializeTo(me.view);
            });
        }
    });

    return WidgetComponent;

})