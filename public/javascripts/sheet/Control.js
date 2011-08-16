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
        view : null
    }

    var Control = Class.extend({

        init       : function(definition, settings){

            this.setup($.extend({}, default_settings, settings));
        },

        /**
         * Добавление в DOM
         * @param parent
         */
        materialize : function(parent){

            //материализация не разрешается для уже матеарилизованных компонент
            if (!this.phantom) return;

            if (_(this.view).isUndefined() || _(this.view).isNull()) {

                this.view = $(this.template);
            }

            parent.append(this.view);

            this.phantom = false;
            //теперь Cell можно получить через data
            this.view.data("control", this);
            $(this).trigger("materialized");
        }

    })

    return Control;

})