
define([
    "./definition/SheetDefinition.js",
    "./Control.js",
    "./Header.js",
    "./Row.js",
    "./HeaderPanel.js",
    "./CellGrid.js"
    ], function(SheetDefinition, Control, Header, Row, HeaderPanel, CellGrid){

    var pv = {};

    var default_settings = {

        class    : "xx-sheet",
        template : "<div class='xx-sheet'></div>",
        /*functionality: [
            "./plugins/Resize.js",
            "./plugins/EditByClick.js",
            "./plugins/HighlightRow.js",
            "./plugins/MoveRows.js",
            "./plugins/MoveColumns.js",
            "./plugins/Select.js"
        ],*/
    }

    //загрузка и инициализация плагинов
    /*require(return_obj.plugins, function(){
        $.each(arguments, function(){
            (new this()).init(return_obj)
        })
    })*/

    var Sheet = Control.extend({

        init       : function(definition, settings){

            this.definition = new SheetDefinition(definition);

            var stx = $.extend({}, default_settings, settings);

            var me = this;

            this.header_panel = new HeaderPanel(me.definition);
            //this.cell_grid = new CellGrid(me.definition);

            this._super(stx);

            var me = this;
            $(this).bind("materialized", function(){

                me.header_panel.materialize(this.view)
            });
        },

        add_plugin : function(plugin){

            if (typeof plugin.init == "function"){
                var plugin = new plugin({sheet: this});
                pv["plugins"].push(plugin);
            }
            $(this).trigger("plugin_added", [plugin]);
        },

        plugins : function(plugins){

            if(_(plugins).isArray()){
                _(plugins).each(this.add_plugin);
            }
            return _(pv["rows"]).clone();
        },

        render : function(){

            this.header_panel.render();
            //this.cell_grid.render();
        },

        header_panel : null,
        grid         : null

    })

    return Sheet;

})
