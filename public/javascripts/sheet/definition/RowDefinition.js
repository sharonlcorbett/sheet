/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "./CellDefinition.js",
    "../helpers/ElementsCollection.js"], function(CellDefinition, ElementsCollection){

    var default_settings = {

        height   : 20,
        orderable: true,
        editable : false,
        format   : null
    }

    var Row = Class.extend({

        init       : function(settings){

            this.cells = ElementsCollection({

                check : function(cell){ typeof cell.init == "undefined" },
                class : CellDefinition
            });

            this.add_setters([
                "height",
                "orderable",
                "editable",
                "format"
            ]);

            this.setup($.extend({}, default_settings, settings));
        }

    })

    return Row;

});