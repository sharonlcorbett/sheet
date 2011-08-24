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

    var Component = new Class({

        Implements : [Options, Events],

        options : {
            elementTag : 'div',
            elementProperties : {},
            elementTemplate : null
        },

        phantom  : true,
        view : null,

        initialize       : function(options){

           this.setOptions(options || {});
        },

        parentView : function(){

            return $(this.view).parent();
        },

        compileTemplate : function(template){

            return new Mooml.Template('template', template);
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        inject : function(parent){

            //материализация не разрешается для уже матеарилизованных компонент
            if (!this.phantom) return;

            if (!this.view) {
                if (this.options.elementTemplate){
                    this.options.elementTemplate = this.compileTemplate(this.options.elementTemplate);
                    this.view = this.options.elementTemplate.render();
                } else {
                    this.view = new Element(this.options.elementTag, this.options.elementProperties)
                }
            }

            this.view.inject(parent)

            this.phantom = false;

            //теперь Cell можно получить через data
            this.view.store("component", this);
            this.fireEvent("injected");
        },

        definition : null,

        applyDefinition : function(def){

            this.definition = def;
        }

    })

    return Component;

})