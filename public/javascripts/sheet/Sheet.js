
define([
    "./definition/SheetDefinition.js",
    "./Control.js",
    "./HeaderPanel.js",
    "./CellGrid.js"
    ], function(
        SheetDefinition,
        Control,
        HeaderPanel,
        CellGrid){

    var default_settings = {

        //класс, который будет добавлен к div-у листа
        class        : "xx-sheet",
        template     : "<div class='xx-sheet'></div>",

        header_panel : null,
        grid         : null
    };

    var Sheet = Control.extend({

        init       : function(definition, settings){

            var me = this;
            //создается объект SheetDefinition, вся работа с листом будет идти через него
            this.definition = new SheetDefinition(definition);

             //вызов конструктора Control
            this._super(definition, $.extend({}, default_settings, settings));
            this.header_panel = new HeaderPanel(this.definition);
            this.grid = new CellGrid(this.definition);

            //после м. листа м. дочерние компоненты
            $(this).bind("materialized", function(){
                me.header_panel.materialize(this.view);
                me.grid.materialize(this.view);
            });
        },

        /**
         * Рендер листа целиком. Вызывает перерисовывание всех дочерних компонент.
         * Может быть крайне медленной операцией при больших размерах листа.
         */
        render : function(){

            this.header_panel.render();
            this.grid.render();
        }
    });

    return Sheet;

});

/*

functionality: [
    "./plugins/Resize.js",
    "./plugins/EditByClick.js",
    "./plugins/HighlightRow.js",
    "./plugins/MoveRows.js",
    "./plugins/MoveColumns.js",
    "./plugins/Select.js"
]

//загрузка и инициализация плагинов
require(return_obj.plugins, function(){
    $.each(arguments, function(){
        (new this()).init(return_obj)
    })
})

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

 */
