
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

            this.header_panel = new HeaderPanel(stx.headers);
            this.cell_grid = new CellGrid();

            delete stx["header"];
            this._super(stx);
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

        header_panel : null,
        grid         : null

    })

    return Sheet;

})
