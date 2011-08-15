/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "./Control.js",
    "./Cell.js",
    "./helpers/ElementsCollection.js"], function(Control, Cell, ElementsCollection){

    var pv = {};

    var default_settings = {

        template : "<tr></tr>",
        height   : 20
    }

    var Row = Control.extend({

        init       : function(settings){

            this.cells = ElementsCollection({

                check : function(cell){ typeof cell.materialize == "undefined" },
                class : Cell
            });

            var me = this;
            $(this.cells).bind("added", function(e, cell){

                me.bind_cell_events(cell);
            })

            this._super($.extend({}, default_settings, settings));
        },

        bind_cell_events : function(c){
            //привязка к событиям ячеек
            var me = this;
            $(c).bind("edit_finished",  function(e, cell){$(me).trigger("edit_finished",  [cell])})
            $(c).bind("edit_cancelled", function(e, cell){$(me).trigger("edit_cancelled", [cell])})
        }
    })

    return Row;

});