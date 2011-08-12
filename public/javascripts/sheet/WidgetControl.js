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

        widget_type   : "Text"
    }

    var WidgetControl = Control.extend({

        init       : function(settings){

            this.add_setters([
                "value",
                "format",
                "widget"
            ]);

            this._super($.extend({}, default_settings, settings));

            var me = this;

            this.widget_loading = this.load_widget();

            //функция привязки событий виджета, выполняется после его инициализации
            this.widget_loading.done(function(){
                $(me.widget()).bind("edit_finished",  function(){$(me).trigger("edit_finished",  [me])})
                $(me.widget()).bind("edit_cancelled", function(){$(me).trigger("edit_cancelled", [me])})
            })

            $(this).bind("setter_field_changed", function(e, name, value){

                switch(name){
                    case "value":
                        this.widget().value(value);

                        //TODO: Может отдать эту логику виджету?
                        this.widget().render();
                        break;
                }
            })

        },

        load_widget : function(){

            var d = $.Deferred();
            if (this.widget()) {
                this.widget_loading.resolve();
            }

            var me = this;
            //создание виджета на основе типа объекта
            require(["/javascripts/sheet/widgets/" + this.widget_type + ".js"], function(Widget){

                me.widget(new Widget());
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

                me.widget().render();
                $(me).trigger("rendered");
            })
        }
    })

    return WidgetControl;

})