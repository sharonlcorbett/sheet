
define([
    "sheet/definitions/SheetDefinition",
    "sheet/Component",
    "sheet/HeaderPanel",
    "sheet/CellGrid"
    ], function(
        SheetDefinition,
        Component,
        HeaderPanel,
        CellGrid){

    var Sheet = Component.extend({

        init       : function(definition, settings){

            var default_settings = {

                //класс, который будет добавлен к div-у листа
                class        : "xx-sheet",
                template     : "<div class='xx-sheet'></div>",

                headersPanel : null,
                grid        : null,

                functions: [
                    "sheet/functions/Resize"
                ],
                fn : {}
            };

            var me = this;
            //создается объект SheetDefinition, вся работа с листом будет идти через него
            this.definition = new SheetDefinition(definition);

             //вызов конструктора Component
            this._super(definition, $.extend({}, default_settings, settings));

            this.headersPanel = new HeaderPanel(this.definition);
            this.grid = new CellGrid(this.definition);

            //после м. листа м. дочерние компоненты
            $(this).bind("materialized", function(){
                me.headersPanel.materializeTo(this.view);
                me.grid.materializeTo(this.view);
            });

            this.functionsLoading = this.loadFunctions();
        },

        /**
         * Рендер листа целиком. Вызывает перерисовывание всех дочерних компонент.
         * Может быть крайне медленной операцией при больших размерах листа.
         */
        render : function(){

            var me = this;

            var d = $.Deferred();
            this.functionsLoading.done(function(){

                $.when(me.headersPanel.render(),
                 me.grid.render())
                    .done(function(){
                        d.resolve();
                        $(me).trigger("rendered");
                    });
            });

            return d.promise();
        },

        loadFunctions : function(){

            var me = this,
                d;

            d = $.Deferred();

            //создание виджета на основе типа объекта
            require(this.functions, function(){
                //асинхронная загрузка и инициализация виджета
                _(arguments).each(function(F){
                    var fn = new F(me);
                    me.fn[fn.name] = fn;
                });
                d.resolve();
            });

            return d.promise();
        },

        __operations : [],

        runOperation : function(operation){

            this.__operations.push(operation);
            operation.execute(this.definition);
        }
    });

    return Sheet;

});

