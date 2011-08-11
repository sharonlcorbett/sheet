/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(function(){

    /**
     * События:
     *  materialized
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     */

    var default_settings = {

        template : "<div></div>",
        phantom  : true,
        //тип виджета для отображения внутри ячейки
        widget_type   : "Text"
    }

    var pv = {};

    var Control = Class.extend({

        init       : function(settings){

            this.add_setters([
                "view",
                "value",
                "format",
                "width",
                "height",
                "template",
                "widget"
            ], pv);

            this.setup(default_settings)
            this.setup(settings);

            var me = this;
            //функция привязки событий виджета, выполняется после его инициализации
            var bind_widget_events = function(){
                $(me.widget()).bind("edit_finished",  function(){$(me).trigger("edit_finished",  [me])})
                $(me.widget()).bind("edit_cancelled", function(){$(me).trigger("edit_cancelled", [me])})
            }

            //ловим инициализацию виджета
            $(this).bind("widget_ready", bind_widget_events);

            if (!this.widget()){
                //создание виджета на основе типа объекта
                require(["/javascripts/sheet/widgets/" + this.widget_type + ".js"], function(Widget){

                    me.widget(new Widget(me));
                    $(me).trigger("widget_ready")
                })
            } else {
                //виджет готов
                $(me).trigger("widget_ready")
            }

        },

        /**
         * отрисовка виджета с применением форматирования и обновление
         * html- кода ячейки
         */
        render     : function(){

            var me = this;
            if (!this.widget()) {
                //отложенный рендер
                $(this).bind("widget_ready", function(){me.widget().render(); $(me).trigger("rendered");})
            } else {
                //немедленный рендер
                this.widget().render();
                $(this).trigger("rendered");
            }
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        materialize : function(parent){

            //материализация не разрешается для уже матеарилизованных компонент
            if (!this.phantom) return;

            if (_(this.view()).isUndefined() || _(this.view()).isNull()) {
                this.view($(this.template()));
            }

            parent.append(this.view());

            this.phantom = false;
            //теперь Cell можно получить через data
            this.view().data("control", this);
            $(this).trigger("materialized");
        }

    })

    return Control;

})