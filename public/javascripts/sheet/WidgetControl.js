/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(["./Control.js"], function(Control){

    /**
     * События:
     *  materialized
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     */

    var default_settings = {

    }

    var WidgetControl = Control.extend({

        init       : function(definition, settings){

            this._super($.extend({}, default_settings, settings));

            this.definition = definition;

            console.log(this.definition)
            if (!this.definition.widget() && !this.definition.inherited_widget()){
                throw "Widget must be set in WidgetControl"
            }

            var me = this;

            this.widget_loading = this.load_widget();

            //функция привязки событий виджета, выполняется после его инициализации
            this.widget_loading.done(function(){

                me.widget.value(me.definition.value());
                me.widget.materialize(me.view);
            });

            $(this.definition).bind("setter", function(e, name, value){

                switch(name){
                    case "value":
                        this.widget.value(value);

                        //TODO: Может отдать эту логику виджету?
                        this.widget.render();
                        break;
                }
            })

        },

        load_widget : function(){

            var d = $.Deferred();
            if (this.widget) {
                this.widget_loading.resolve();
            }

            var me = this;

            var widget_definition = this.definition.widget() || this.definition.inherited_widget();

            //создание виджета на основе типа объекта
            require(["/javascripts/sheet/widgets/" + widget_definition.type() + ".js"], function(Widget){

                me.widget = new Widget(widget_definition);
                d.resolve();
            })
            return d;
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
        }
    })

    return WidgetControl;

})