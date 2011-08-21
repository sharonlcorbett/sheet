/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    'sheet/definitions/Definition',
    "sheet/definitions/CellDefinition",
    "sheet/helpers/ElementsCollection"
    ], function(
        Definition,
        CellDefinition,
        ElementsCollection){

    var Row = Definition.extend({

        init       : function(settings){

            var default_settings = {
                height   : 20,
                orderable: true,
                editable : false,
                format   : null
            };

            this.cells = ElementsCollection({
                check : function(cell){ typeof cell.init == "undefined" },
                class : CellDefinition
            });

            this.addSetters([
                "height",
                "orderable",
                "editable",
                "format",
                "idx"
            ]);

            this.setup($.extend({}, default_settings, settings));
        }

    });

    return Row;

});