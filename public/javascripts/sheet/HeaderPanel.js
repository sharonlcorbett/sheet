/**
 * Строка заголовков, одна на лист
 */
define(["./Control.js", "./Header.js"], function(Control, Header){

    var pv = {};

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

            pv["headers"] = [];
            this._super($.extend({}, default_settings, settings));
        },

        add_header : function(header){

            if (typeof header.materialize == "undefined"){
                header = new Header(header);
            }
            pv["headers"].push(header);
            $(this).trigger("header_added", [header]);
        },

        remove_header : function(header){

            pv["headers"] = _(pv["headers"]).without(header);
            $(this).trigger("header_removed", [header]);
        },

        headers : function(headers){

            if(_(headers).isArray()){
                _(headers).each(this.add_header);
            }
            return _(pv["headers"]).clone();
        }
    })

    return HeaderPanel;

})