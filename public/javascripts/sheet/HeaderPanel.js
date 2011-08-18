/**
 * Строка заголовков, одна на лист
 */
define([
    "sheet/Control",
    "sheet/ColumnHeader"], function(
        Control,
        ColumnHeader){

    var HeaderPanel = Control.extend({

        init       : function(definition, settings){

            var default_settings = {

                template :
                    "<div class='header_table'>" +
                        "<table>" +
                        "<tr>" +
                        "</tr>" +
                        "</table>" +
                        "</div>",
                selectors : {
                    materialization : "tr"
                },
                headers : []
            };

            var me = this;

            this.definition = definition;
            this._super(definition, $.extend({}, default_settings, settings));

            _(this.definition.columns()).each(function(column){
                //создаем заголовки на основании Definition
                me.headers.push(new ColumnHeader(column));
            });

            $(this).bind("materialized", function(){
                //при материализиции панели заголовков материализуем Headerы
                _(me.headers).each(function(header){
                    header.materialize(me.view.find(me.selectors.materialization));
                });
            });
        },

        render : function(){

            //отрисовка заголовков
            _(this.headers).each(function(h){h.render()});
        }
    });

    return HeaderPanel;

});