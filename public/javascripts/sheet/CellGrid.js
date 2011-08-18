define([
    "sheet/Control",
    "sheet/Row"], function(
        Control,
        Row){

    var default_settings = {

        template : "<div class='grid'><table></table></div>",
        rows     : []
    };

    var CellGrid = Control.extend({

        init       : function(definition, settings){

            var me = this;
            this._super(definition, $.extend({}, default_settings, settings));
            this.definition = definition;

            _(this.definition.rows()).each(function(row){
                //создаем строки на основании Definition
                me.rows.push(new Row(row));
            });

            $(this).bind("materialized", function(){
                //при материализиции панели заголовков материализуем Headerы
                _(me.rows).each(function(row){
                    row.materialize(me.view.find("table"));
                });
            });
        },

        render : function(){

            //отрисовка заголовков
            _(this.rows).each(function(r){r.render()});
        }
    });

    return CellGrid;

});