define([
    "sheet/Control",
    "sheet/Row"], function(
        Control,
        Row){

    var CellGrid = Control.extend({

        init       : function(definition, settings){

            var default_settings = {
                template : "<div class='grid'><table></table></div>",
                rows     : []
            };

            var me = this;
            this._super(definition, $.extend({}, default_settings, settings));
            this.definition = definition;

            _(this.definition.rows()).each(function(row_d){
                //создаем строки на основании Definition
                var crow = new Row(row_d);
                me.rows.push(crow);
            });

            $(this).bind("materialized", function(){
                //при материализиции панели заголовков материализуем Headerы
                var table = me.view.find("table");
                _(me.rows).each(function(row){
                    row.materialize(me.view.find("table"));
                });
            });
        },

        render : function(){

            //отрисовка заголовков
            var d = $.Deferred();

            var deferred = [];
            _(this.rows).each(function(r){deferred.push(r.render())});

            $.when.apply(this, deferred).then(function(){
                d.resolve();
            });

            return d.promise();
        }
    });

    return CellGrid;

});