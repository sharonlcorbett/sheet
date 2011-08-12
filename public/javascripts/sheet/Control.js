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
        phantom  : true
    }

    var Control = Class.extend({

        init       : function(settings){

            this.add_setters([
                "view",
                "width",
                "height",
                "template"
            ]);

            this.setup(default_settings)
            this.setup(settings);

            var me = this;
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