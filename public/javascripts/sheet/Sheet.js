
define([
    'sheet/definitions/SheetDefinition',
    'sheet/Component',
    'sheet/HeaderPanel',
    'sheet/CellGrid',
    'sheet/OperationManager'
    ], function(
        SheetDefinition,
        Component,
        HeaderPanel,
        CellGrid,
        OperationManager){

    var Sheet = new Class({

        Extends : Component,

        Binds : ['injectComponents'],

        options : {
            elementTag : 'div',
            elementProperties : {
                class : 'xx-sheet'
            }
        },

        fn : {},

        functions : [
            //'sheet/functions/Resize'
        ],

        operationManager : null,

        initialize : function(options){

            this.parent(options)

            this.headersPanel = new HeaderPanel();
            this.grid         = new CellGrid();

            this.functionsLoading = this.loadFunctions();
            this.operationManager = new OperationManager(this);
        },

        inject : function(element){

            this.parent(element);
            this.headersPanel.inject(this.view);
            this.grid.inject(this.view);
        },

        applyDefinition : function(def){

            this.parent(def);
            this.headersPanel.applyDefinition(def.columns());
            this.grid.applyDefinition(def.rows());
        },

        /**
         * Рендер листа целиком. Вызывает перерисовывание всех дочерних компонент.
         * Может быть крайне медленной операцией при больших размерах листа.
         */
        render : function(){

            var me = this;

            me.headersPanel.render();
            me.grid.render();

            me.fireEvent('rendered');
        },

        loadFunctions : function(){

            var me = this;
            require(this.functions, function(){

                //асинхронная загрузка и инициализация виджета
                _(arguments).each(function(F){
                    var fn = new F(me);
                    me.fn[fn.name] = fn;
                });

                me.fireEvent('ready');
            });
        }
    });

    return Sheet;

});

