define([
    "./Control.js",
    "./Row.js"], function(Control, Row){

    var pv = {};

    var default_settings = {

        template : "<table></table>",
        rows : [{}]
    }

    var CellGrid = Control.extend({

        init       : function(settings){

            pv["rows"] = [];
            this._super($.extend({}, default_settings, settings));
        },

        add_row : function(row){

            if (typeof row.materialize == "undefined"){ row = new Row(row); }
            pv["rows"].push(row);
            $(this).trigger("row_added", [row]);
        },

        remove_row : function(row){

            pv["rows"] = _(pv["rows"]).without(row);
            $(this).trigger("row_removed", [row]);
        },

        rows : function(rows){

            if(_(rows).isArray()){
                var me = this;
                _(rows).each(this.add_row);
            }
            return $.extend({}, pv["rows"]);
        }
    });

    return CellGrid;

});