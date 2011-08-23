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

        initialize       : function(def){

            this.addFields([
                {
                    name : "height",
                    defaultValue : 20
                },
                {
                    name : "orderable",
                    defaultValue : true
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
                    name : "idx"
                },
                {
                    name : "cells",
                    type : "collection",
                    construct : CellDefinition
                }
            ]);

            this.parent(def);
        }

    });

    return Row;

});