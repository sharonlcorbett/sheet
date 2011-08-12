/**
 * Строка заголовков, одна на лист
 */
define(["./Control.js", "./Header.js"], function(Control, Header){

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

            this.__set_private("headers", []);
            this._super($.extend({}, default_settings, settings));

            $(this).bind("materialized", function(){

                //при материализиции панели заголовков материализуем Headerы
                var me = this;
                _(this.headers()).each(function(header){

                    header.materialize(me.view().find("tr"))
                })
            })
        },

        add_header : function(header){

            if (typeof header.materialize == "undefined"){
                header = new Header(header);
            }

            this.headers().push(header);
            $(this).trigger("header_added", [header]);
        },

        remove_header : function(header){

            this.headers(
                this.headers().without(header));
            $(this).trigger("header_removed", [header]);
        },

        headers : function(headers){

            var me = this;
            if(_(headers).isArray()){
                _(headers).each($.proxy(me.add_header, me));
            }
            return this.__get_private("headers");
        },

        render : function(){

            //отрисовка заголовков
            _(this.headers()).each(function(h){h.render()});
        }
    })

    return HeaderPanel;

})