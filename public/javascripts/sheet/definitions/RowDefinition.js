/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    'sheet/definitions/Definition',
    "sheet/definitions/CellDefinition"
    ], function(
        Definition,
        CellDefinition){

    var Row = new Class({

        Extends : Definition,

        idx : null,

        initialize       : function(def){

            this.addFields([
                {
                    name : "height",
                    defaultValue : 20
                },
                {
                    name : "editable",
                    defaultValue : false
                },
                {
                    name : "format",
                    defaultValue : null
                },
                {
                    name : "cells",
                    type : "collection",
                    elementConstructor : CellDefinition
                }
            ]);

            this.parent(def);
        }

    });

    return Row;

});