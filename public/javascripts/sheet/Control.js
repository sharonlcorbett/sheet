/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(function(){

    return function(settings){

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
            dom_element : null,
            widget     : null,
            //тип виджета для отображения внутри ячейки
            widget_type   : "Text",
            //формат ячейки
            format     : {}
        }

        var return_obj = $.extend({}, default_settings, settings);

        //функция привязки событий виджета, выполняется после его инициализации
        var bind_widget_events = function(){
            $(return_obj.widget).bind("edit_finished",  function(){$(return_obj).trigger("edit_finished",  [return_obj])})
            $(return_obj.widget).bind("edit_cancelled", function(){$(return_obj).trigger("edit_cancelled", [return_obj])})
        }

        //ловим инициализацию виджета
        $(return_obj).bind("widget_ready", bind_widget_events);

        $.extend(return_obj, {

            init       : function(){

                if (!return_obj.widget){
                    //создание виджета на основе типа объекта
                    require(["/javascripts/sheet/widgets/" + return_obj.widget_type + ".js"], function(Widget){
                        var wxobj = new Widget(return_obj);
                        return_obj.widget = wxobj
                        $(return_obj).trigger("widget_ready")
                    })
                } else {
                    //виджет готов
                    $(return_obj).trigger("widget_ready")
                }

            },

            /**
             * отрисовка виджета с применением форматирования и обновление
             * html- кода ячейки
             */
            render     : function(){

                var me = this;
                if (!this.widget) {
                    $(this).bind("widget_ready", function(){me.widget.render()})
                } else {
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
                    this.dom_element = dom_element;
                }
                return this.dom_element;
            },


            super : function(object){

                if(object){
                    this.__super = object;

                }
            }

        })

        //создание макроса на функцию view, чтобы не путаться при программировании
        return_obj[return_obj.dom_element_name] = return_obj.view()

        return new (Class.extend(return_obj))()
    }
})