/**
 * Визуальный контрол,
 * содержащий определенный набор разных DOM - элементов листа
 */
define(
    [
        'sheet/Definition'
    ],
    function(
        Definition
    ){

    /**
     * События:
     *  materialized
     *  edit_finished
     *  edit_cancelled
     *  widget_ready
     */

    var Component = new Class({

        Implements : [Options, Events, Definition],

        options : {
            elementTag : 'div',
            elementProperties : {},
            elementTemplate : null
        },

        phantom  : true,
        view : null,

        initialize       : function(options){

           this.setOptions(options || {});

            if (this.options.elementTemplate){
                this.options.elementTemplate = this.compileTemplate(this.options.elementTemplate);
            }

            if (this.options.elementTemplate){
                this.view = this.options.elementTemplate.render();
            } else {
                this.view = new Element(this.options.elementTag, this.options.elementProperties)
            }

            //теперь Cell можно получить через data
            this.view.store('component', this);
        },

        parentView : function(){

            if(!this.phantom){
                return this.view.getParent();
            }
        },

        compileTemplate : function(template){

            return new Mooml.Template('template', template);
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        inject : function(parent){

            this.view.inject(parent);

            this.phantom = false;
            this.fireEvent('injected');
        }
    })

    return Component;

})