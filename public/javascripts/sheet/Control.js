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
        dom_element_name : "view",
        widget     : null,
        //тип виджета для отображения внутри ячейки
        widget_type   : "Text"
    }

    var __format = null;
    var __value = null;
    var __dom_element = null;

    var return_obj = Class.extend({

        init       : function(settings){

            this.setup(default_settings)
            this.setup(settings);

            var me = this;
            //функция привязки событий виджета, выполняется после его инициализации
            var bind_widget_events = function(){
                $(me.widget).bind("edit_finished",  function(){$(me).trigger("edit_finished",  [me])})
                $(me.widget).bind("edit_cancelled", function(){$(me).trigger("edit_cancelled", [me])})
            }

            //ловим инициализацию виджета
            $(this).bind("widget_ready", bind_widget_events);

            if (!this.widget){
                //создание виджета на основе типа объекта
                require(["/javascripts/sheet/widgets/" + this.widget_type + ".js"], function(Widget){
                    var wxobj = new Widget(me);
                    me.widget = wxobj
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
            if (!this.widget) {
                //отложенный рендер
                $(this).bind("widget_ready", function(){me.widget.render()})
            } else {
                //немедленный рендер
                this.widget.render();
            }
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        materialize : function(parent){
            //материализация не разрешается для уже матеарилизованных компонент
            if (!this.phantom) return;
            parent.append(this.view());
            this.phantom = false;
            //теперь Cell можно получить через data
            this.view().data("control", this);
            $(this).trigger("materialized")
        },

        /*
         * Получение или присвоение визуального компонента DOM
         */
        view : function(dom_element){

            if(dom_element){
                __dom_element = dom_element;
            }
            return __dom_element;
        },

        /*
         * Каждому контролу может быть присвоено какое- либо значение.
         * Значение может быть любого типа.
         */
        value : function(value){

            if(value){
                __value = value
            }
            return __value;
        },

        format : function(format){

            if(format){
                __format = format;
            }
            return __format;
        }

    })

    return return_obj;

})