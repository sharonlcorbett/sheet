define([
    "./Control.js",
    "./Row.js",
    "./helpers/ElementsCollection.js"], function(Control, Row, ElementsCollection){

    var default_settings = {

        template : "<table></table>"
    }

    var CellGrid = Control.extend({

        init       : function(settings){

            this.rows = ElementsCollection({

                check : function(row){ typeof row.materialize == "undefined" },
                class : Row
            });

            this._super($.extend({}, default_settings, settings));
        }
    });

    return CellGrid;

});