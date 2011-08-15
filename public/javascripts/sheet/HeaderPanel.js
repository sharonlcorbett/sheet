/**
 * Строка заголовков, одна на лист
 */
define([
    "./Control.js",
    "./Header.js",
    "./helpers/ElementsCollection.js"], function(Control, Header, ElementsCollection){

    var default_settings = {

        template :
            "<div class='header_table'>" +
                "<table>" +
                    "<tr>" +
                    "</tr>" +
                "</table>" +
            "</div>",
        headers : [{}]
    }

    var HeaderPanel = Control.extend({

        init       : function(settings){

            this.headers = ElementsCollection({

                check : function(header){ typeof header.materialize == "undefined" },
                class : Header
            });

            this._super($.extend({}, default_settings, settings));

            $(this).bind("materialized", function(){

                //при материализиции панели заголовков материализуем Headerы
                var me = this;
                _(this.headers()).each(function(header){

                    header.materialize(me.view().find("tr"))
                })
            })
        },

        render : function(){

            //отрисовка заголовков
            _(this.headers()).each(function(h){h.render()});
        }
    })

    return HeaderPanel;

})