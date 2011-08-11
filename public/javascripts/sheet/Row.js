/**
 * Строка таблицы
 *
 * @param settings
 * @param table_row
 */
define([
    "./Control.js",
    "./Cell.js"], function(Control, Cell){

    var pv = {};

    var default_settings = {

        template : "<tr></tr>",
        height   : 20
    }

    var Row = Control.extend({

        init       : function(settings){

            this._super($.extend({}, default_settings, settings));
            var me = this;
            //привязка к событиям ячеек
            $(this.cells()).bind("edit_finished",  function(e, cell){$(me).trigger("edit_finished",  [cell])})
            $(this.cells()).bind("edit_cancelled", function(e, cell){$(me).trigger("edit_cancelled", [cell])})
        },

        add_cell : function(cell){

            if (typeof cell.materialize == "undefined"){
                cell = new Cell(cell);
            }
            pv["cells"].push(cell);
            $(this).trigger("cell_added", [cell]);
        },

        cells : function(cells){

            if(_(cells).isArray()){
                _(cells).each(this.add_cell);
            }
            return _(pv["cells"]).clone();
        }
    })

    return Row;

});