
define([
    "./Control.js",
    "./Header.js",
    "./Row.js",
    "./HeaderPanel.js",
    "./CellGrid.js"
    ], function(Control, Header, Row, HeaderPanel, CellGrid){

    var pv = {};

    var default_settings = {

        class    : "xx-sheet",
        template : "<div class='xx-sheet'></div>",
        /*plugins: [
            "./plugins/Resize.js",
            "./plugins/EditByClick.js",
            "./plugins/HighlightRow.js",
            "./plugins/MoveRows.js",
            "./plugins/MoveColumns.js",
            "./plugins/Select.js"
        ],*/
        headers : [{}]
    }

    //загрузка и инициализация плагинов
    /*require(return_obj.plugins, function(){
        $.each(arguments, function(){
            (new this()).init(return_obj)
        })
    })*/

    var Sheet = Control.extend({

        init       : function(settings){

            var stx = $.extend({}, default_settings, settings);

            this.header_panel = new HeaderPanel({headers : stx.headers});
            this.cell_grid = new CellGrid({rows : stx.rows});

            delete stx["headers"];
            delete stx["rows"];

            this._super(stx);

            var me = this;
            $(this).bind("materialized", function(){

                me.header_panel.materialize(this.view())
            })

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
